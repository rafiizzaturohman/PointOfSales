$(document).ready(function () {
    $('#users-table').DataTable({
        "lengthMenu": [[3, 5, 10, -1], [3, 5, 10, 'All']],
        "processing": true,
        "serverSide": true,
        "ajax": "/users/datatable",
        "columns": [
            { "data": "userid" },
            { "data": "email" },
            { "data": "name" },
            { "data": "role" },
            {
                "data": "userid",
                render: function (data) {
                    return `
                    <div class="flex space-x-2">
                        <a href="/users/edit/${data}" class="transition bg-green-600 px-2 py-1 rounded-full hover:bg-green-500 text-white"><i class="fa-solid fa-circle-info"></i></a>

                        <button class="transition block modal-open text-white bg-red-600 hover:bg-red-700 font-medium rounded-full text-sm px-2.5 py-1 text-center items-center" type="button" onclick="toggleModal('modal-delete${data}')"><i class="fa-solid fa-trash"></i></button>

                        <div class="hidden overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center"
                            id="modal-delete${data}">
                            <div class="relative w-auto my-6 mx-auto max-w-3xl">
                                <!--content-->
                                <div
                                    class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                    <!--header-->
                                    <div
                                        class="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                        <h3 class="text-3xl font-semibold text-black">
                                            Delete Confirmation
                                        </h3>
                                        <button
                                            class="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                            onclick="toggleModal('modal-delete${data}')">
                                            <span
                                                class="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                                ×
                                            </span>
                                        </button>
                                    </div>
                                    <!--body-->
                                    <div class="relative p-6 flex-auto">
                                        <p class="my-4 text-slate-500 text-lg leading-relaxed">
                                            Are you sure, you want to delete it?
                                        </p>
                                    </div>
                                    <!--footer-->
                                    <div
                                        class="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                        <button
                                            class="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button" onclick="toggleModal('modal-delete${data}')">
                                            No
                                        </button>
                                        <a href="/users/delete/${data}"
                                            class="bg-emerald-500 text-white active:bg-emerald-600 font-semibold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            onclick="toggleModal('modal-delete')">
                                            Yes
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="hidden opacity-25 fixed inset-0 z-40 bg-black"
                            id="modal-delete-backdrop"></div>
                    </div>
                    `
                }
            }
        ]
    });

    $('#units-table').DataTable({
        "lengthMenu": [[3, 5, 10, -1], [3, 5, 10, 'All']],
        "processing": true,
        "serverSide": true,
        "ajax": "/units/datatable",
        "columns": [
            { "data": "unit" },
            { "data": "name" },
            { "data": "note" },
            {
                "data": "unit",
                render: function (data) {
                    return `
                    <div class="flex space-x-2">
                        <a href="/units /edit/${data}" class="transition bg-green-600 px-2 py-1 rounded-full hover:bg-green-500 text-white"><i class="fa-solid fa-circle-info"></i></a>

                        <button class="transition block modal-open text-white bg-red-600 hover:bg-red-700 font-medium rounded-full text-sm px-2.5 py-1 text-center items-center" type="button" onclick="toggleModal('modal-delete${data}')"><i class="fa-solid fa-trash"></i></button>

                        <div class="hidden overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center"
                            id="modal-delete${data}">
                            <div class="relative w-auto my-6 mx-auto max-w-3xl">
                                <!--content-->
                                <div
                                    class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                    <!--header-->
                                    <div
                                        class="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                        <h3 class="text-3xl font-semibold text-black">
                                            Delete Confirmation
                                        </h3>
                                        <button
                                            class="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                            onclick="toggleModal('modal-delete${data}')">
                                            <span
                                                class="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                                ×
                                            </span>
                                        </button>
                                    </div>
                                    <!--body-->
                                    <div class="relative p-6 flex-auto">
                                        <p class="my-4 text-slate-500 text-lg leading-relaxed">
                                            Are you sure, you want to delete it?
                                        </p>
                                    </div>
                                    <!--footer-->
                                    <div
                                        class="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                        <button
                                            class="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button" onclick="toggleModal('modal-delete${data}')">
                                            No
                                        </button>
                                        <a href="/units/delete/${data}"
                                            class="bg-emerald-500 text-white active:bg-emerald-600 font-semibold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            onclick="toggleModal('modal-delete')">
                                            Yes
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="hidden opacity-25 fixed inset-0 z-40 bg-black"
                            id="modal-delete-backdrop"></div>
                    </div>
                    `
                }
            }
        ]
    });

    $('#goods-table').DataTable({
        "lengthMenu": [[3, 5, 10, -1], [3, 5, 10, 'All']],
        "processing": true,
        "serverSide": true,
        "ajax": "/goods/datatable",
        "columns": [
            { "data": "barcode" },
            { "data": "name" },
            { "data": "stock" },
            {
                "data": "purchaseprice",
                render: function (data) {
                    return `Rp. ${data}`
                }
            },
            {
                "data": "sellingprice",
                render: function (data) {
                    return `Rp. ${data}`
                }
            },
            { "data": "unit" },
            {
                "data": "picture",
                render: function (data) {
                    return `<img src="/images/upload/${data}" class="w-auto"></img>`
                }
            },
            {
                "data": "barcode",
                render: function (data) {
                    return `
                <div class="flex space-x-2">
                    <a href="/goods/edit/${data}" class="transition bg-green-600 px-2 py-1 rounded-full hover:bg-green-500 text-white"><i class="fa-solid fa-circle-info"></i></a>
                    <button class="transition block modal-open text-white bg-red-600 hover:bg-red-700 font-medium rounded-full text-sm px-2.5 py-1 text-center items-center" type="button" onclick="toggleModal('modal-delete${data}')"><i class="fa-solid fa-trash"></i></button>
                    <div class="hidden overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center"
                        id="modal-delete${data}">
                        <div class="relative w-auto my-6 mx-auto max-w-3xl">
                            <!--content-->
                            <div
                                class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                <!--header-->
                                <div
                                    class="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                    <h3 class="text-3xl font-semibold text-black">
                                        Delete Confirmation
                                    </h3>
                                    <button
                                        class="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                        onclick="toggleModal('modal-delete${data}')">
                                        <span
                                            class="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                            ×
                                        </span>
                                    </button>
                                </div>
                                <!--body-->
                                <div class="relative p-6 flex-auto">
                                    <p class="my-4 text-slate-500 text-lg leading-relaxed">
                                        Are you sure, you want to delete it?
                                    </p>
                                </div>
                                <!--footer-->
                                <div
                                    class="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                    <button
                                        class="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button" onclick="toggleModal('modal-delete${data}')">
                                        No
                                    </button>
                                    <a href="/goods/delete/${data}"
                                        class="bg-emerald-500 text-white active:bg-emerald-600 font-semibold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        onclick="toggleModal('modal-delete')">
                                        Yes
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="hidden opacity-25 fixed inset-0 z-40 bg-black"
                        id="modal-delete-backdrop"></div>
                </div>
                `
                }
            }
        ]
    });
})

var loadFile = function (event) {
    var reader = new FileReader();
    reader.onload = function () {
        var output = document.getElementById('output');
        output.src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
};