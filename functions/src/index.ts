import { https, setGlobalOptions } from "firebase-functions/v2";
import { defineSecret } from "firebase-functions/params";
import * as admin from "firebase-admin";
import axios from "axios";

// Initialize Firebase Admin SDK
admin.initializeApp();

setGlobalOptions({ region: "asia-northeast3" });

const kakaoRestApiKey = defineSecret("KAKAO_REST_API_KEY");
const kakaoClientSecret = defineSecret("KAKAO_CLIENT_SECRET");
// Define the expected type for the data payload sent from the client
interface KakaoAuthData {
    code: string;
    redirectUri: string;
}

/**
 * Callable Cloud Function to get Kakao user info and optionally create/update Firebase user.
 *
 * @param {functions.https.CallableRequest<KakaoAuthData>} request - The request object from the client.
 * @returns {Promise<object>} - An object containing Firebase UID, custom token, and Kakao profile info.
 */

export const getKakaoUserInfoAndSignIn = https.onCall(
  { 
    region: "asia-northeast3",
    secrets: [kakaoRestApiKey, kakaoClientSecret], 
  },
  async (request: https.CallableRequest<KakaoAuthData>) => {
  // Access the data payload from request.data
    const kakaoAuthCode = request.data.code;
    const redirectUri = request.data.redirectUri;

    if (!kakaoAuthCode || typeof kakaoAuthCode !== "string") {
      throw new https.HttpsError("invalid-argument", "A valid Kakao access token (string) is required.");
    }
    if (!redirectUri || typeof redirectUri !== "string") {
      throw new https.HttpsError("invalid-argument", "A valid redirect URI (string) is required.");
    }

    try {
      //Exchange authorization code for access token with Kakao ---
      const tokenResponse = await axios.post("https://kauth.kakao.com/oauth/token", null, {
        params: {
          grant_type: "authorization_code",
          client_id: kakaoRestApiKey.value(),
          redirect_uri: redirectUri,
          code: kakaoAuthCode,
          client_secret: kakaoClientSecret.value(), // Only if you configured one
        },
        headers: {
          "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      });

      const kakaoAccessToken = tokenResponse.data.access_token;

      // Step 2: Call Kakao User Information API using the obtained access token
      const kakaoResponse = await axios.get("https://kapi.kakao.com/v2/user/me", {
        headers: {
          "Authorization": `Bearer ${kakaoAccessToken}`,
          "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      });

      const kakaoUser = kakaoResponse.data;

      // Extract key user data from Kakao response
      const kakaoUserId = kakaoUser.id;
      const nickname = kakaoUser.kakao_account?.profile?.nickname;
      const profileImage = kakaoUser.kakao_account?.profile?.profile_image_url;
      const email = kakaoUser.kakao_account?.email;

      // Step 2: Optional - Create or update a Firebase user using a Custom Token
      const firebaseUid = `kakao:${kakaoUserId}`;

      let customToken: string;
      let userRecord: admin.auth.UserRecord;
      let isNewUser = false;

      try {
        // Try to create a new user
        userRecord = await admin.auth().createUser({
          uid: firebaseUid,
          displayName: nickname,
          photoURL: profileImage,
          email: email,
          emailVerified: !!email,
        });
        isNewUser = true;
      } catch (err: any) {
        if (err.code === "auth/email-already-exists") {
          // Email already registered → use existing Firebase user
          userRecord = await admin.auth().getUserByEmail(email);

          // ⚠️ Don't attempt to link providers manually with Admin SDK
          // Just reuse existing user for custom token
        } else if (err.code === "auth/uid-already-exists") {
          // UID already taken → likely re-login → fetch and reuse
          userRecord = await admin.auth().getUser(firebaseUid);
        } else {
          console.error("Error creating or retrieving user:", err);
          throw new https.HttpsError("internal", "Failed to create or fetch user.", err.message);
        }
      }

      // Create a custom token using the final Firebase UID
      customToken = await admin.auth().createCustomToken(userRecord.uid);

      // Step 3: Return relevant data to the client
      return {
        uid: firebaseUid,
        customToken: customToken,
        kakaoProfile: {
          id: kakaoUserId,
          nickname: nickname,
          profileImage: profileImage,
          email: email,
        },
        newUser: isNewUser,
        kakaoAccessToken: kakaoAccessToken,
      };

    } catch (error: any) { // This 'any' will be allowed by ESLint config below
      console.error("Error in getKakaoUserInfoAndSignIn:", error.response?.data || error.message || error);

      if (error.response && error.response.data) {
        const kakaoErrorCode = error.response.data.code;
        if (kakaoErrorCode === -401) {
          throw new https.HttpsError("unauthenticated", "Invalid Kakao access token. Please re-authenticate.", error.response.data);
        }
        throw new https.HttpsError("internal", `Kakao API error (Code: ${kakaoErrorCode}).`, error.response.data);
      }

      throw new https.HttpsError("internal", "An unexpected error occurred during Kakao integration.", error.message);
    }
  });