let req = new Request("http://t-online.de/a/api/v1/pages/sections/homepage.json");
req.method = "get";
req.headers = {
    "content-type": "application/json",
};

let res = await req.loadJSON();
//log(JSON.stringify(res, null, 2));

let colorManatee = new Color("#8D93A6")

const getHeadline = (res.sectionPage.stages[0].streamItems[0].articleTeaser.article.fields.headline);
log(getHeadline)
const getTopline = res.sectionPage.stages[0].streamItems[0].articleTeaser.article.fields.top_line
const authorLastname = res.sectionPage.stages[0].streamItems[0].articleTeaser.article.elements[0].assets[0].fields.headline

const article = res.sectionPage.stages[0].streamItems[0].articleTeaser.article

let headerImage= null;

if (article.elements.length > 0 && article.elements[0]?.children && article.elements[0].children.length > 0)  {
  const assets = article.elements[0]?.children[0]?.assets
  const authorImage = assets.filter(asset => asset.fields.crop === '1:1') 
  let header = authorImage[0].fields.url;
  let reqHeader = new Request(header);
  headerImage = await reqHeader.loadImage();
}


const elements = res.sectionPage.stages[0].streamItems[0].articleTeaser.article.elements
const titleImages = elements.filter(element => element.type === 'IMAGE')
const typeImage = titleImages[0].assets.filter(asset => asset.type === 'IMAGE')
const cropImage = typeImage.filter(asset => asset.fields.crop === '1:1')
const teaserImageFound = cropImage[0].fields.url
log(teaserImageFound)

let reqTeaser = new Request(teaserImageFound)
let teaserImage = await reqTeaser.loadImage()


let widget = createWidget()
let bgColor = new Color("#171717")


widget.backgroundColor = bgColor
if (config.runsInWidget) {
  // create and show widget
  Script.setWidget(widget)
  Script.complete()
}
else {
  widget.presentMedium()
}

function createWidget() {
  let w = new ListWidget()
    let manatee = new Color("#8D93A6")
    
    w.addSpacer(10);
     // entry widget
  let main = w.addStack()
  
  // head in main
  let head = w.addStack()
      head.spacing = 7;
      head.layoutHorizontally()
        
  //T-Online text
  let logo = head.addText("T-Online")
      logo.font = Font.mediumRoundedSystemFont(17);
      
      head.addSpacer(null)
  //Nachrichten Text on the top
  
  let nachrichten = head.addText("Nachrichten")
      nachrichten.font = Font.mediumRoundedSystemFont(17);
      nachrichten.textColor = manatee
      
      w.addSpacer()
 
// rounded line
  const line = w.addStack()
        line.cornerRadius = 45;
        line.backgroundColor = new Color("#3E3D42")
        line.size = new Size(300 ,2)
        w.addSpacer()
      
  let body = w.addStack()
 
  let bodyContent = body.addStack()
      bodyContent.layoutVertically();
      bodyContent.topAlignContent()
      bodyContent.size = new Size(180, 100);
      bodyContent.spacing = 2;
      
  
  let topline = bodyContent.addText(getTopline);
      topline.font = Font.regularRoundedSystemFont(10);
      topline.textColor = manatee;
  
  
  
  
  let title = bodyContent.addText(getHeadline)
      title.font = Font.semiboldRoundedSystemFont(14)
      title.lineLimit = 4;
  
    body.addSpacer(20)
  
  //stack for authorImafe and authorName
  let author = bodyContent.addStack()
  
  //author image
  if (headerImage) {
    let authorImage = author.addImage(headerImage)
        authorImage.cornerRadius = 45;
        authorImage.imageSize = new Size(24, 24)
        authorImage.leftAlignImage()
  }
       
  let authorName = author.addText(authorLastname.slice(12))
      authorName.font = Font.lightRoundedSystemFont(12)
      authorName.textColor = manatee
      authorName.centerAlignText()
  
  
  
  let bodyImage = body.addStack()
  
  let image = bodyImage.addImage(teaserImage)
      image.cornerRadius = 14
      image.imageSize = new Size(100, 100)
      image.rightAlignImage()
      
    w.addSpacer(10);
 
//Font.mediumRoundedSystemFont(14)

  return w
}
