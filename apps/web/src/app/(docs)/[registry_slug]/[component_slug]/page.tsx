export default async function ComponentPage({
  params,
}: {
  params: Promise<{ registry_slug: string; component_slug: string }>;
}) {
  const { registry_slug, component_slug } = await params;

  return (
    <div>
      <h1>Registry: {registry_slug}</h1>
      <h2>Component: {component_slug}</h2>
      <p>Component documentation page</p>
    </div>
  );
}
