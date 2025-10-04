test("GET to api/tmdb/info should return 200", async () => {
  const id = "1236470";
  const qs = new URLSearchParams({
    id,
    append: "videos,images,credits,aggregate_credits,recommendations,keywords",
  });
  const res = await fetch(`http://localhost:3000/api/tmdb/info?${qs}`, {
    cache: "no-store",
  });
  expect(res.status).toBe(200);
});
