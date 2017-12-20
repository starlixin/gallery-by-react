require('normalize.css/normalize.css');
require('styles/App.scss');

//获取图片相关的数据
var imageDatas = require('../data/imagedatas.json');
//利用自执行函数，将图片信息转成图片URL路径信息
imageDatas=(function genImageURL(imageDataArr){//生成图片文件的路径
  for(var i= 0,j=imageDataArr.length;i<j;i++){
    var singleImageDta =imageDataArr[i];
    singleImageDta.imageURL=require('../images'+singleImageDta.fileName);
    imageDataArr[i]= singleImageDta.imageURL;
  }
  return imageDataArr;
})(imageDatas);


import React from 'react';


class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
        <section className="img-sec"></section>
        <nav className="controller-nav">

        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
