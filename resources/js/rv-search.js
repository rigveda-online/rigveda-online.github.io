var search_server = null;
var global_result_selector = null;
var search_allowed = true;

const query_error_string = `
<div class="search-error-message">
    <p>No matches found. Here could be the following reasons:</p>
    <ul class="list-group w-50">
        <li class="list-group-item">Your query actually does not exist in the corpus.</li>
        <li class="list-group-item">The search server is down, try searching something simple like "Indra" to see if you get a result.</li>
        <li class="list-group-item"><b>The Sanskrit search is not implemented YET.</li>
    </ul>
</div>
`;

const server_error = `
<div class="search-error-message">
<p>
    There was an error while requesting the search server. It may be down. 
    Contact site administrator if you see this message. Alternatively, you can host
    this whole website locally cloning the repo along with the search server.
</p>
</div>`

function ProgressBarScrollCallback() {
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop,
        height = document.documentElement.scrollHeight - document.documentElement.clientHeight,
        scrolled = (winScroll / height);

    /* Since we have disabled scroll bars, we will display the scroll position as a line on the top of the page. */
    if (scrolled <= 0) {
        $(".progress-container").fadeOut();
    }
    else {
        $(".progress-container").fadeIn();
        document.getElementById("progressBar").style.width = (scrolled * 100) + "%";
    }
}

function AddLoadingSpinner(selector)
{
    $(selector).append(`
        <div class="spinner-border" role="status" id="loading-spinner">
            <span class="sr-only">Loading...</span>
        </div>
    `);
}

function RemoveLoadingSpinner()
{
    $('#loading-spinner').remove();
}

function GenerateResultCard(book, hymn, match)
{
    var result_card = `
        <div class="col-12">
            <div class="card my-3">
                <div class="card-body">
                    <div class="result-location">
                        ${book}.${hymn}
                    </div>
                    <div class="result-match">
                        ${match}
                    </div>
                </div>
                <a class="stretched-link" href="/${book}/${hymn}.html"></a>
            </div>
        </div>
    `
    return result_card;
}

function SearchRV(result_selector, query, language)
{
    $(result_selector).empty();
    AddLoadingSpinner(result_selector);
    global_result_selector = result_selector;
    var xhr = new XMLHttpRequest();
    xhr.onerror = () => {
        $(global_result_selector).html(server_error);
    };

    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 0)
        {
            $(global_result_selector).html(server_error);
            RemoveLoadingSpinner();
            search_allowed = true;
        }
        else if (xhr.readyState === 4 && xhr.status === 200) {
            RemoveLoadingSpinner();
            var results = JSON.parse(xhr.responseText);
            if(Object.keys(results).length == 0)
            {
                $(global_result_selector).html(query_error_string);
                search_allowed = true;
                return;
            }
            for(const key in results)
            {
                var book_hymn = key.split(':');
                $(global_result_selector).append(GenerateResultCard(book_hymn[0], book_hymn[1], results[key]["surrounding"]));
            }
            search_allowed = true;
        }
    };
    var url = search_server;
    var data = JSON.stringify({"text": `RV_${language}`, "query": query});
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data);
}

$(document).ready(() => {
    $.getJSON("/config.json", function (data) {
        search_server = data["search_server"];
        var url_string = window.location.href;
        var url = new URL(url_string);
        var query = url.searchParams.get("query");
        if(query.length > 0)
        {
            $('#query-box').val(query)
            SearchRV('#rv-search-results', $('#query-box').val(), $("#search-language").val());
        }
    });
    $(".progress-container").hide();
    document.addEventListener('scroll', () => {
        ProgressBarScrollCallback();
    });
    $('#query-box').on('keypress', (e) => {
        if(e.key == 'Enter' && search_allowed == true)
        {
            e.preventDefault();
            SearchRV('#rv-search-results', $('#query-box').val(), $("#search-language").val());
            search_allowed = false;
        }
    });
})