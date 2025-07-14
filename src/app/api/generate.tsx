export async function generateOutline(formData: any) {
  const response = await fetch("https://api.barojiwon.com/generate-outline", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  });

  if (!response.ok) {
    // Parse the JSON error body
    const errorData = await response.json();
    throw new Error(`API 호출 실패: ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  return data;
}

export async function generateEssay(payload: any) {
  const response = await fetch("https://api.barojiwon.com/generate-essay", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    // Parse the JSON error body
    const errorData = await response.json();
    throw new Error(`API 호출 실패: ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  return data;
}

export async function generateFeedback(payload: any) {
  const response = await fetch("https://api.barojiwon.com/generate-feedback-and-request", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });


  if (!response.ok) {
    // Parse the JSON error body
    const errorData = await response.json();
    throw new Error(`API 호출 실패: ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  return data;
}

export async function generateRevision(payload: any) {
  const response = await fetch("https://api.barojiwon.com/revise-essay-draft", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    // Parse the JSON error body
    const errorData = await response.json();
    throw new Error(`API 호출 실패: ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  return data;
}

export async function generateSubQuestions(payload: any) {
  const response = await fetch("https://api.barojiwon.com/dynamic-generate-subquestions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });


  if (!response.ok) {
    // Parse the JSON error body
    const errorData = await response.json();
    throw new Error(`API 호출 실패: ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  return data;
}

export async function generateFreeEssay(payload: any) {
  const response = await fetch("https://api.barojiwon.com/dynamic-generate-essay", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });


  if (!response.ok) {
    // Parse the JSON error body
    const errorData = await response.json();
    throw new Error(`API 호출 실패: ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  return data;
}
// https://api.barojiwon.com/generate
// http://3.149.237.144