const AUDIO_LOAD_ICON = `<span class="fa fa-hourglass"></span>`;
const AUDIO_NORMAL_ICON = `<span class="fa fa-volume-up"></span>`;
const AUDIO_PLAYING_ICON = `<span class="fa fa-stop"></span>`;

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

function PlayHymnAudio()
{
    var audio_element = document.getElementById('hymn_audio');
    if(!audio_element.paused)
    {
        audio_element.pause();
        audio_element.currentTime = 0;
        $('#play_hymn_button').html(AUDIO_NORMAL_ICON);
    }
    else {
        audio_element.play();
        $('#play_hymn_button').html(AUDIO_PLAYING_ICON);
    }
}

$(document).ready(() => {
    /* Hide the progress bar */
    $(".progress-container").hide();
    var n_stanzas = document.getElementsByClassName('card').length;
    var stanza_height = document.getElementsByClassName('card')[0].offsetHeight;

    document.addEventListener('scroll', () => {
        ProgressBarScrollCallback();
    });

    var audio_element = document.getElementById('hymn_audio');
    audio_element.addEventListener('loadstart', () => {
        $('#play_hymn_button').html(AUDIO_LOAD_ICON)
    });

    audio_element.addEventListener('canplaythrough', () => {
        $('#play_hymn_button').html(AUDIO_NORMAL_ICON);
    });

    audio_element.addEventListener('ended', () => {
        $('#play_hymn_button').html(AUDIO_NORMAL_ICON);
        audio_element.currentTime = 0;
    });

    /* Scroll while playing audio */
    audio_element.ontimeupdate = function () {
        var percent_scroll = audio_element.currentTime / audio_element.duration;
        window.scrollTo(0, stanza_height * Math.floor(percent_scroll * n_stanzas));
    }

});