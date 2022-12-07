// $(document).ready(function () {
//     dataNotif()
// })

// const dataNotif = () => {
//     $.ajax({
//         method: 'GET',
//         url: 'notification/notif'
//     }).done((data) => {
//         console.log(data)
//         let html = ''
//         data.forEach(item => {
//             html += `
//             <div class="bg-amber-400 text-white rounded-full px-2 py-1">
//                 <i class="fa-solid fa-triangle-exclamation"></i>
//             </div>

//             <div class="text-sm mx-2">
//                 <p class="text-slate-400">Barcode: ${item.barcode} </p>
//                 <p class="text-gray-600">
//                     <span class="font-bold" href="#">Stock Alert: </span> replied on the <span
//                         class="font-bold text-blue-500" href="#">only have stock </span> artical . 2m
//                 </p>
//             </div>
//             `
//         })
//         $('#notif').html(html)
//     }).fail((err) => {
//         console.log(err)
//     })
// }