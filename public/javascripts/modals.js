$(document).ready(() => {
    $('#table-users').on('click', '.btn-delUsers', () => {
        const userid = $(this).attr('dataid')
        $('#popup-modal').modal('show')
    })
})

const hideModal = () => {
    $('#popup-modal').modal('show')
}