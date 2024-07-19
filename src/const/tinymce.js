import OSS from 'ali-oss';

export default {
    plugins: "link lists image wordcount contextmenu",
    toolbar: "bold italic underline | fontsizeselect | link unlink image",
    height: 500,
    images_upload_handler: function (blobInfo, success, failure) {
        let file = blobInfo.blob();
        let oss = JSON.parse(window.localStorage.getItem("mewooo-aliossKey"));
        const prefix =
            "other/" +
            new Date()
                .toJSON()
                .slice(0, 19)
                .replace(/-/g, "/")
                .replace(/:/g, "/")
                .replace(/T/g, "/") +
            "/";
        const fileArray = file.name.split(".");
        const filename =
            prefix + window.btoa(fileArray[0]) + "." + fileArray[1];
        if (!oss || Date.now() >= Date.parse(oss.Expiration)) {
            getOssKey().then((res, oss) => {
                oss = res.data.data;
                window.localStorage.setItem(
                    "mewooo-aliossKey",
                    JSON.stringify(oss)
                );

                const client = new OSS({
                    accessKeyId: oss.AccessKeyId,
                    accessKeySecret: oss.AccessKeySecret,
                    stsToken: oss.SecurityToken,
                    endpoint: "oss-cn-shenzhen.aliyuncs.com",
                    bucket: "cnbuy-test"
                });


                client.put(filename, file).then(res => {
                    const imgUrl = res.url;
                    success(imgUrl);
                })
            });
        } else {
            const client = new OSS({
                accessKeyId: oss.AccessKeyId,
                accessKeySecret: oss.AccessKeySecret,
                stsToken: oss.SecurityToken,
                endpoint: "oss-cn-shenzhen.aliyuncs.com",
                bucket: "cnbuy-test"
            });

            client.put(filename, file).then(res => {
                const imgUrl = client.getObjectUrl(filename);
                success(imgUrl);
            })
        }
    }
}