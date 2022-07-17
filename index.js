const DownloadButton = document.getElementById('download');
const Loading = document.getElementById('loading');
const NFT = document.getElementById('nft-content');

window.addEventListener('message', (e) => {
  console.log(e.data);

  const { event } = e.data;

  if (event === 'ready') {
    // window
    console.log('ready');
    NFT.contentWindow.postMessage(
      {
        event: 'StartDrawMountain',
        args: {
          borderWidth: 0.0,
          collabData: {
            CheYu: [],
            Wen: [],
            Lien: [],
            Jinyao: [],
            Oivm: [],
          },
        },
      },
      '*'
    );
  }

  if (event === 'draw_finish') {
    console.log('Draw Finish');
    DownloadButton.classList.remove('hidden');
    Loading.classList.add('hidden');
  }
});

let isDownloading = false;

DownloadButton.addEventListener('click', (e) => {
  if (!isDownloading) {
    NFT.contentWindow.postMessage({ event: 'SaveImage' }, '*');
    DownloadButton.innerText = 'Downloading.....';
    isDownloading = true;
  }
});

const [_, _fab, tokenId] = window.location.pathname.split('/');

if (parseInt(tokenId) > 0) {
  NFT.setAttribute(
    'src',
    `https://token.fab.tw/artifact/${tokenId}?isCollage=1`
  );
}
