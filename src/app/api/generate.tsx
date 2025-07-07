export async function generateOutline(formData: any) {
  const response = await fetch("https://barojiwon.com/generate-outline", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  });

  if (!response.ok) {
    // Parse the JSON error body
    const errorData = await response.json();
    console.log("Full error response:", errorData);

    throw new Error(`API 호출 실패: ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  return data;
}

export async function generateEssay(payload: any) {
  const response = await fetch("https://barojiwon.com/generate-essay", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    // Parse the JSON error body
    const errorData = await response.json();
    console.log("Full error response:", errorData);

    throw new Error(`API 호출 실패: ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  return data;
}

// https://barojiwon.com/generate
// http://3.149.237.144