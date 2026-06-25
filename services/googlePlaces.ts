export type PlaceSuggestion = {
  placeId: string;
  name: string;
  address: string;
};

export type PlaceDetail = {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
};

const KEY = process.env.EXPO_PUBLIC_GOOGLE_KEY ?? '';

export async function searchPlaces(query: string): Promise<PlaceSuggestion[]> {
  if (!query.trim()) return [];
  if (!KEY) {
    console.warn('[GooglePlaces] EXPO_PUBLIC_GOOGLE_KEY is not set. Autocomplete disabled.');
    return [];
  }

  const response = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': KEY,
    },
    body: JSON.stringify({ input: query }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Google Autocomplete error ${response.status}: ${body}`);
  }

  const data = await response.json();
  const suggestions: PlaceSuggestion[] = (data.suggestions ?? []).map((s: any) => {
    const pred = s.placePrediction;
    // placeId can be bare id or "places/<id>"
    const placeId = (pred.placeId ?? pred.place ?? '').replace(/^places\//, '');
    const name = pred.structuredFormat?.mainText?.text ?? pred.text?.text ?? '';
    const address = pred.structuredFormat?.secondaryText?.text ?? '';
    return { placeId, name, address };
  });

  return suggestions;
}

export async function getPlaceDetails(placeId: string): Promise<PlaceDetail | null> {
  if (!KEY) {
    console.warn('[GooglePlaces] EXPO_PUBLIC_GOOGLE_KEY is not set. Place details disabled.');
    return null;
  }

  const cleanId = placeId.replace(/^places\//, '');
  const response = await fetch(`https://places.googleapis.com/v1/places/${cleanId}`, {
    method: 'GET',
    headers: {
      'X-Goog-Api-Key': KEY,
      'X-Goog-FieldMask': 'id,displayName,formattedAddress,location',
    },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Google Place Details error ${response.status}: ${body}`);
  }

  const data = await response.json();
  return {
    name: data.displayName?.text ?? '',
    address: data.formattedAddress ?? '',
    latitude: data.location?.latitude ?? 0,
    longitude: data.location?.longitude ?? 0,
  };
}
