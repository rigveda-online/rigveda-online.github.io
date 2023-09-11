const MANDALA_BUTTON_RADIUS = 200;

function CreateMandalaButtons() {
    for(var i = 1; i <= 10; i++)
    {
        var mandala_button_html = `
        <div class="col-lg-4 col-md-12 col-sm-12 mx-auto">
            <div class="card shadow my-3 py-3 btn-mandala">
            <a href="/${i}/index.html" class="stretched-link"></a>
            <div class="row">
                <div class="col-4">
                    <img src="/resources/images/mandala.png" width="64px" class="img-fluid">
                </div>
                <div class="col-8">
                    Mandala ${i}
                </div>
            </div>
        </div>
        `;
        $('.rv-mandala-buttons').append(mandala_button_html);
    }
}

$(document).ready(() => {
    CreateMandalaButtons();
    $('#query-box').on('keypress', (e) => {
        if(e.key == 'Enter')
        {
            window.location.href = `/search.html?query=${$('#query-box').val()}`
        }
    });
});