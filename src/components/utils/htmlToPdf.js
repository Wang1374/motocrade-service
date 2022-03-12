// 导出页面为PDF格式
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'
export default {
    install(Vue, options) {
        Vue.prototype.getPdf = function (title) {
            // 导出之前先将滚动条置顶,不然会出现数据不全的现象
            window.pageYOffset = 0;
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;

            // 设置dialog距离头部155
            document.getElementById("unitContent").scrollTop = 155;

            const loading = this.$loading({
                lock: true,
                text: '导出中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            html2Canvas(document.querySelector('#printPackingList'), {
                allowTaint: true,
                useCORS: true,
                taintTest: false,
                useCORS: true,
                dpi: window.devicePixelRatio * 4, //将分辨率提高到特定的DPI 提高四倍
                scale: 4 //按比例增加分辨率 
            }).then(function (canvas) {
                let contentWidth = canvas.width
                let contentHeight = canvas.height
                let pageHeight = contentWidth / 592.28 * 841.89
                let leftHeight = contentHeight
                let position = 10
                let imgWidth = 819.28
                let imgHeight = 852.28 / contentWidth * contentHeight

                let pageData = new Image();
                //设置图片跨域访问
                pageData.setAttribute('crossOrigin', 'Anonymous');

                setTimeout(() => {
                    pageData = canvas.toDataURL('image/jpeg', 1.0);
                    let PDF = new JsPDF('l', 'pt', 'a4')
                    if (leftHeight < pageHeight) {
                        PDF.addImage(pageData, 'JPEG', 10, 10, imgWidth, imgHeight)
                    } else {
                        while (leftHeight > 0) {
                            PDF.addImage(pageData, 'JPEG', 10, position, imgWidth, imgHeight)
                            leftHeight -= pageHeight
                            position -= 841.89
                            if (leftHeight > 0) {
                                PDF.addPage()
                            }
                        }
                    }
                    loading.close();
                    PDF.save(title + '.pdf')
                }, 1000);
            })
        }
    }
}
