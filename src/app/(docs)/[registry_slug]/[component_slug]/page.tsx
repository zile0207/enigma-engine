export default function ComponentPage({
  params,
}: {
  params: { registry_slug: string; component_slug: string };
}) {
  return (
    <div>
      <h1>Registry: {params.registry_slug}</h1>
      <h2>Component: {params.component_slug}</h2>
      <p>Component documentation page</p>
    </div>
  );
}
