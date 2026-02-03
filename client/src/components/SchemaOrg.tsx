import { useEffect } from "react";

interface SchemaOrgProps {
  schema: Record<string, any>;
}

export default function SchemaOrg({ schema }: SchemaOrgProps) {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [schema]);

  return null;
}
