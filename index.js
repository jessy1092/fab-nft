const DownloadButton = document.getElementById('download');
const Loading = document.getElementById('loading');
const NFT = document.getElementById('nft-content');
const SizeSelect = document.getElementById('size');

window.addEventListener('message', (e) => {
  // console.log(e.data);

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

    Loading.classList.remove('hidden');
    // NFT.contentWindow.postMessage({ event: 'GetFeatureData' }, '*');
  }

  if (event === 'send_feature_data') {
    console.log(e.data.args);
  }

  if (event === 'draw_finish') {
    console.log('Draw Finish');
    DownloadButton.classList.remove('hidden');
    Loading.classList.add('hidden');
  }
});

let isDownloading = false;
let isJinYao = false;
const [_, _fab, tokenId] = window.location.pathname.split('/');

const JinYaoResolutionMap = {
  qHD: 'sHD',
  HD: 'qHD',
  FourK: 'HD',
};

DownloadButton.addEventListener('click', (e) => {
  if (!isDownloading) {
    NFT.contentWindow.postMessage({ event: 'SaveImage' }, '*');
    DownloadButton.innerText = 'Downloading.....';
    isDownloading = true;
  }
});

SizeSelect.addEventListener('change', (e) => {
  NFT.setAttribute('src', '');

  if (e.target.value !== '') {
    NFT.classList.remove('sHD');
    NFT.classList.remove('qHD');
    NFT.classList.remove('HD');
    NFT.classList.remove('FourK');

    if (isJinYao) {
      NFT.classList.add(JinYaoResolutionMap[e.target.value]);
    } else {
      NFT.classList.add(e.target.value);
    }

    if (parseInt(tokenId) > 0) {
      NFT.setAttribute(
        'src',
        `https://token.fab.tw/artifact/${tokenId}?isCollage=1`
      );
    }
  }
});

const getMetadata = async (id) => {
  const res = await fetch(`https://token.fab.tw/metadata/${id}`);

  const data = await res.json();

  return data;
};

const run = async () => {
  if (parseInt(tokenId) > 0) {
    const data = await getMetadata(tokenId);

    console.log(data.attributes);

    isJinYao =
      data.attributes.findIndex(({ value }) => value === 'Jinyao Lin') >= 0;

    if (isJinYao) {
      NFT.classList.remove('qHD');
      NFT.classList.remove('HD');
      NFT.classList.remove('FourK');
      NFT.classList.add('qHD');
    }

    NFT.setAttribute(
      'src',
      `https://token.fab.tw/artifact/${tokenId}?isCollage=1`
    );
  }
};

run();
