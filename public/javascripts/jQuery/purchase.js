let invoice = '<%= purchases.invoice%>';
$(document).ready(function () {
    readDetails()
    //munculin detail barang ketika dipiih barcode
    $('#barcode').change(function () {
        const barcode = $(this).val()
        $.get(`/purchases/goods/${barcode}`).done(function (data) {
            console.log('ini data', data)
            $('#name').val(data.name)
            $('#stock').val(data.stock)
            $('#purchaseprice').val(data.purchaseprice)
            $('#quantity').val(1)
            $('#totalprice').val(data.totalprice)
        })
    })


    $('#quantity').keyup(function () {
        const quantity = $(this).val()
        const purchaseprice = $('#purchaseprice').val()
        $('#totalprice').val(currencyFormatter.format(purchaseprice * quantity))
    })


    $('#detail-form').submit(function (e) {
        e.preventDefault();
        const itemcode = $('#barcode').val()
        const quantity = $('#quantity').val()
        $.post('/purchases/add', { invoice, itemcode, quantity }).done(function (data) {
            readDetails()
            $('#totalsum').val(currencyFormatter.format(data.totalsum))
        })
    })
})


const readDetails = () => {
    $.get(`/purchases/details/${invoice}`).done(function (data) {
        let html = ''
        data.forEach((item, index) => {
            html += `
                    <tr>
                        <td>
                            ${index + 1}
                        </td>
                        <td>
                            ${item.itemcode}
                        </td>
                        <td>
                            ${item.name}
                        </td>
                        <td>
                            ${item.quantity}
                        </td>
                        <td>
                            ${currencyFormatter.format(item.purchaseprice)}
                        </td>
                        <td>
                            ${currencyFormatter.format(item.totalprice)}
                        </td>
                        <td>
                            <a type="button" class="btn btn-danger rounded-circle"onclick="$('#modal-delete${item.invoice}').modal('show')"
                               title="Delete" ><i class="fas fa-solid fa-trash"></i></a>
                        
                            <div class="modal fade" id="modal-delete${item.invoice}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div class="modal-dialog" role="document">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title">Deleted confirmation</h5>
                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"onclick="$('#modal-delete').modal('hide')">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div class="modal-body">
                                            <p>Are you sure, you want to delete it?</p>
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-dismiss="modal"onclick="$('#modal-delete').modal('hide')">No</button>
                                            <a id="btn-delete" type="button" class="btn btn-primary" id="btn-deleted" href="/purchases/delete/${item.invoice}">Yes</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    `
        })
        $('#detail-table tbody').html(html)
    })
}