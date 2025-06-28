export async function generateOutline(formData: any) {
  const response = await fetch("https://barojiwon.com/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  });

  if (!response.ok) {
    throw new Error("API 호출 실패");
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
    throw new Error("API 호출 실패");
  }

  const data = await response.json();
  return data;
}

// https://barojiwon.com/generate