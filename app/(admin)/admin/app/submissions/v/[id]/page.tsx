export default async function AdminViewJobApplication({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  console.log(id);

  return <div>Job Application</div>;
}
