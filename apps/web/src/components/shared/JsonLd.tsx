/**
 * JSON-LD Structured Data Component
 *
 * Usage:
 * <JsonLd data={schemaObject} />
 */

type JsonLdValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | JsonLdObject
  | JsonLdValue[];

type JsonLdObject = {
  [key: string]: JsonLdValue;
};

interface JsonLdProps {
  data: JsonLdObject | JsonLdObject[];
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 0),
      }}
    />
  );
}
