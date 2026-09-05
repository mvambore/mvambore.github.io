// import-movies.js
const { createClient } = require('@supabase/supabase-js');
const movies = require('./movies.json');

const supabase = createClient(
  'https://zxyhpeaabioaebbiudhq.supabase.co',
  'sb_publishable_9fB9ratG6x-mW15fe4XB2g_eiYfPu7h' // or service_role key if RLS blocks anon insert
);

async function run() {
  const rows = movies.map(m => {
    const rt = m.Ratings?.find(r => r.Source === 'Rotten Tomatoes');
    return {
      imdb_id: m.imdbID,
      title: m.Title,
      year: m.Year,
      genre: m.Genre,
      plot: m.Plot,
      poster: m.Poster,
      imdb_rating: m.imdbRating,
      rotten_tomatoes: rt ? rt.Value : null
    };
  });

  const { data, error } = await supabase
    .from('movies')
    .upsert(rows, { onConflict: 'imdb_id' });

  if (error) console.error('Import failed:', error);
  else console.log(`Imported ${rows.length} movies`);
}

run();
