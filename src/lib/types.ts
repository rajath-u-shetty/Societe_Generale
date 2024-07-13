export type AiResponse = {
  name: string,
  "givenSopItems": { name: "string", id: number }[],
  "enhancedSopItems": { name: "string", id: number }[],
  "scoreOfEnteredSOPItems": number,
  "description": "string"
}
