$(document).ready(() => {
    $('#table-users').on('click', '', () => {
        const userid = $(this).attr('dataid')
        $('#popup-modal').modal('show')
    })
})