export async function generateOutline(formData: any) {
  const response = await fetch("http://18.188.33.83:8000/generate", {
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