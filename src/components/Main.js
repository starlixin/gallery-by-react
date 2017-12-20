require('normalize.css/normalize.css');
require('styles/App.scss');

//获取图片相关的数据
var imageDatas = require('../data/imageDatas.json');
//利用自执行函数，将图片信息转成图片URL路径信息
imageDatas=(function genImageURL(imageDataArr){//生成图片文件的路径
  for(var i= 0,j=imageDataArr.length;i<j;i++){
    var singleImageDta =imageDataArr[i];
    singleImageDta.imageURL=require('../images/'+singleImageDta.filename);
    imageDataArr[i]= singleImageDta;
  }
  return imageDataArr;
})(imageDatas);


import React from 'react';

var ImgFigure= React.createClass({
  render:function(){

    console.log(this.props.data);
    return (
        <figure className="img-figure">
          <img src={this.props.data.imageURL}
              alt={this.props.data.title}/>
          <figcaption>
            <h2 className="img-title">{this.props.data.title}</h2>
          </figcaption>
        </figure>
    );
  }
})

class AppComponent extends React.Component {
  render() {
    var controllerUnits=[],
        imgFigures =[];

    imageDatas.forEach(function(value){
      imgFigures.push(
        <ImgFigure data={value}/>
        )
    });
    return (
      <section className="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
