import { ActivityFormData } from "../components/ui/activityForm";

export async function createActivityService(formData: ActivityFormData, token: string) {
  const formDataToSend = new FormData();
  if (formData.image) {
    formDataToSend.append("image", formData.image as Blob);
  }
  formDataToSend.append("title", formData.title);
  formDataToSend.append("description", formData.description);
  formDataToSend.append("typeId", formData.typeId);
  formDataToSend.append("address", JSON.stringify(formData.address));
  formDataToSend.append("scheduledDate", formData.scheduledDate);
  formDataToSend.append("private", String(formData.approvalRequired));

  const response = await fetch("http://localhost:3000/activities/new", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formDataToSend,
  });
  if (!response.ok) throw new Error("Erro ao criar atividade");
  return response.json();
}