const USER_AGENT = "FanPlatform/1.0 (spotlight.com)";


const lookupArtistMBID = async (name) => {
  console.log("looking up artist")
  if (!name) return null;
  console.log(name)

  try {
    const query = encodeURIComponent(`artist:"${name}"`);
    const url = `https://musicbrainz.org/ws/2/artist/?query=${query}&fmt=json`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      console.error(`MusicBrainz lookup failed: ${res.status}`);
      return null;
    }

    const data = await res.json();
    const artists = data.artists || [];
    console.log(artists)
    if (artists.length === 0) return null;

    // artists are already sorted by score (confidence), highest first
    const best = artists[0];

    // require a reasonably confident match — MusicBrainz scores are 0-100
    if (best.score < 85) {
      console.warn(
        `MusicBrainz match for "${name}" too low-confidence (score: ${best.score}) — skipping auto-link`
      );
      return null;
    }

    return best.id;
  } catch (error) {
    console.error("MusicBrainz lookup error:", error.message);
    return null;
  }
};

module.exports = { lookupArtistMBID };