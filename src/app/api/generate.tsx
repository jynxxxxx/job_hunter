export async function generateOutline(formData: any) {
  console.log("form", JSON.stringify(formData))
  const response = await fetch("http://3.135.187.169:8000/generate", {
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