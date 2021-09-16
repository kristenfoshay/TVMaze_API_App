
async function searchShows(query) {
	console.log('searchTerm is: ', query);
	let result = await $.ajax({
		url     : `http://api.tvmaze.com/search/shows?q=${query}`,
		type    : 'GET',
		success : function(response) {
			response.map((item) => {
				let show = item.show;
				return {
					id      : show.id,
					name    : show.name,
					summary : show.summary,
					image   : show.image
				};
			});
		}
	});
	console.log(result);
	console.log(typeof result);

	function populateShows(x) {
		console.log(x);
		const $showsList = $('#shows-list');
		$showsList.empty();

		for (let show of x) {
			let $item = $(
				`<div class="col-md-6 col-lg-3 Show" data-show-id="${show.show.id}">
             <div class="card" data-show-id="${show.show.id}">
               <img class="card-img-top" src="${show.show.image.medium}">
               <div class="card-body">
                 <h5 class="card-title">${show.show.name}</h5>
                 <p class="card-text">${show.show.summary}</p>
                 <button class="btn btn-primary get-episodes" id="${show.show.id}">Episodes</button>
               </div>
             </div>  
           </div>
          `
			);

			$showsList.append($item);
		}
	}

	populateShows(result);
}

$('#search-form').on('submit', async function handleSearch(evt) {
	evt.preventDefault();

	let query = $('#search-query').val();
	if (!query) return;

	$('#episodes-area').hide();

	await searchShows(query); //"shows" declaration doesn't seem to be very helpful here but "await searchShows(query) is necessary."
});

let id = $('#shows-list').on('click', function getID(event) {
	let ID = event.target.id;
	getEpisodes(ID);
});

async function getEpisodes(id) {
	console.log('id is: ', id);
	let result = await $.ajax({
		url     : `http://api.tvmaze.com/shows/${id}/episodes`,
		type    : 'GET',
		success : function(response) {
			console.log(response);
			let episodes = response.map((episode) => ({
				id     : episode.id,
				name   : episode.name,
				season : episode.season,
				number : episode.number
			}));
			console.log(episodes);
			console.log(episodes[0].id);

			console.log(episodes);
			populateEpisodes(episodes);

			function populateEpisodes(episodes) {
				$('#episodes-area').show();
				const $episodesList = $('#episodes-list');
				if ($episodesList) {
					console.log('populateEpisodes exists!');
				}
				$episodesList.empty();
				console.log(episodes);
				console.log(episodes.length);
				console.log(Object.keys(episodes));

				for (let i = 0; i < episodes.length; i++) {
					console.log(episodes[i]);

					let $item = $(
						`<li>
				  ${episodes[i].name}
				   (season ${episodes[i].season}, episode ${episodes[i].number})
				</li>`
					);

					$episodesList.append($item);
					continue;
				}
			}

			$('#shows-list').on('click', '.get-episodes', async function handleEpisodeClick(evt) {
				let showId = $(evt.target).closest('.Show').data('show-id');
				let episodes = await getEpisodes(id);
			});
		}
	});
}
