import QRCode from "react-qr-code";

export default function QrCodeComponent(id) {
  let dappLink =
    "https://metamask.app.link/dapp/6srqqqzf-3000.asse.devtunnels.ms/";

  console.log(id.id);

  return (
    <div>
      <QRCode size={450} value={`${dappLink}public-block/details/${id.id}`} />
    </div>
  );
}
