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
import ReactDOM from 'react-dom';
/**
 * 获取区间内的一个随机值
 */
  function getRangeRandom(low,high){
    return Math.floor(Math.random()*(high-low)+low)
  }

/**
 * 获取0~30°之间的任意正负值
 */
  function get30DegRandom(){
  return (Math.random()>0.5?'':'-')+ Math.floor(Math.random()*30);
}

var ImgFigure= React.createClass({
  /**
   * imgFigure的点击处理函数
   */
  handleClick:function(e){
    // 如果点击的是当前正在选中态的按钮，则翻转图片，否则置为居中态
    if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  },
  render:function(){
    var styleObj={};
    //如果props属性中指定了这张图片的位置，则使用
    if(this.props.arrange.pos){
      styleObj=this.props.arrange.pos;
    }

    //如果图片的旋转角度有值且不为0，添加旋转角度
    if(this.props.arrange.rotate){
      ['-moz-','-ms-','-webkit-',''].forEach(function(value){
        styleObj[value+'transform'] = 'rotate('+
          this.props.arrange.rotate+'deg)';
      }.bind(this))
    }
    var imgFigureClassName='img-figure';
    imgFigureClassName+=this.props.arrange.isInverse? ' is-inverse':'';
    return (
        <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
          <img src={this.props.data.imageURL}
              alt={this.props.data.title}/>
          <figcaption>
            <h2 className="img-title">{this.props.data.title}</h2>
            <div className="img-back">
              <p>
                {this.props.data.desc}
              </p>
            </div>
          </figcaption>
        </figure>
    );
  }
})

class AppComponent extends React.Component {

  constructor(props){
    super(props);
    this.Constant={
      centerPos:{
        left:0,
          right:0
      },
      hPosRange:{//水平方向的取值范围
        leftSecX:[0,0],
        rightSecX:[0,0],
        y:[0,0]
      },
      vPosRange:{ // 垂直方向的取值范围
        x:[0,0],
          topY:[0,0]
      }
    };
    this.state = {
      imgsArrangeArr:[
        /*{
          pos:{
            left:0,
            top:0
          },
          rotate:0,         // 旋转角度
          isInverse:false,//图片正反面
        }*/
      ]
    }
  }

  /**
   * 翻转图片
   * @param index 输入当前被执行inverse操作的图片对应的图片信息数据的index值
   * @return {Function}这是一个闭包函数，其内return一个真正待被执行的函数
   */
  inverse(index) {
    return function () {
      var imgsArrangeArr = this.state.imgsArrangeArr;
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
      this.setState({
        imgsArrangeArr: imgsArrangeArr
      })

    }.bind(this);
  }
  /*
   * 反转图片
   * @param index 输入执行inverse 操作图片的index值
   * @return {Function} 闭包，返回真正待执行的函数
   */
  center(index) {
    return function(){
      this.rearrange(index);
    }.bind(this);
  }

  /*
  *重新布局图片
  * @param centerIndex 指定居中排布哪个图片
   */
  rearrange(centerIndex){
    console.log('rearrange function');
      var imgsArrangeArr= this.state.imgsArrangeArr;
       var Constant= this.Constant,
        centerPos= Constant.centerPos,
        hPosRange =Constant.hPosRange,
        vPosRange =Constant.vPosRange,
        hPosRangeLeftSecX=hPosRange.leftSecX,
        hPosRangeRightSecX=hPosRange.rightSecX,
        hPosRangeY =hPosRange.y,
        vposRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,

        imgsArrangeTopArr=[],
        topImgNum =Math.floor(Math.random()*2),//取一个或不取
         topImgSpliceIndex =0,
        imgsArrangeCenterArr=imgsArrangeArr.splice(centerIndex,1);

        //首先居中centerIndex的图片,居中的 centerIndex 的图片不需要旋转
        imgsArrangeCenterArr[0]={
          pos:centerPos,
          rotate :0,
          isCenter:true
        };


        //取出要布局上侧的图片的状态信息
        topImgSpliceIndex=Math.floor(Math.random()*(imgsArrangeArr.length-topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

        //布局位于上册的图片
        imgsArrangeTopArr.forEach(function(value,index) {
          imgsArrangeTopArr[index]={
            pos:{
              top:getRangeRandom(vposRangeTopY[0],vposRangeTopY[1]),
              left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])
            },
            rotate:get30DegRandom(),
            isInverse:false,
            isCenter:false
          }
        });
       //布局两侧的图片
          for(var i=0,j=imgsArrangeArr.length,k=j / 2;i<j;i++){
           var hPosRangeLORX=null;
            //前半部分布局左边，右半部分布局右边
            if(i<k){
              hPosRangeLORX = hPosRangeLeftSecX;
            }else {
              hPosRangeLORX = hPosRangeRightSecX;
            }
            imgsArrangeArr[i] ={
              pos :{
                top:getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
                left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
              },
              rotate:get30DegRandom(),
              isInverse:false,
              isCenter:false
            }
          }
          if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
            imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
          }
          imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);
    console.log(imgsArrangeArr);
          this.setState({
            imgsArrangeArr:imgsArrangeArr
          });
  }

  //getInitialState(){
  //  return {
  //    imgsArrangeArr:[]
  //  };
  //}

  //组件加载以后，为每张图片计算其位置的范围
  componentDidMount(){

    //拿到舞台的大小
    console.log('componentDidMount function');
      var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
        stageW = stageDOM.scrollWidth,
        stageH = stageDOM.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2);
      //拿到一个imageFigure的大小
      var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
        imgW = imgFigureDOM.scrollWidth,
        imgH = imgFigureDOM.scrollHeight,
        halfImgW = Math.ceil(imgW/2),
        halfImgH = Math.ceil(imgH/2);
    console.log(stageH);
    console.log(imgH);
      //计算中心图片的位置点
      this.Constant.centerPos = {
        left:halfStageW-halfImgW,
        top:halfStageH - halfStageH
      }
      //计算左侧、右侧区域图片排布位置的取值范围
      this.Constant.hPosRange.leftSecX[0] = -halfImgW;
      this.Constant.hPosRange.leftSecX[1] =halfStageW-halfImgW * 3;
      this.Constant.hPosRange.rightSecX[0]= halfStageW+halfImgW;
      this.Constant.hPosRange.rightSecX[1]= stageW-halfImgW;
      this.Constant.hPosRange.y[0] = -halfImgH;
      this.Constant.hPosRange.y[0]= stageH-halfImgH;
      //计算上侧区域图片排布位置的取值范围
      this.Constant.vPosRange.topY[0] = -halfImgH;
      this.Constant.vPosRange.topY[1] = halfStageH-halfImgH*3;
      this.Constant.vPosRange.x[0] = halfImgW -imgW;
      this.Constant.vPosRange.x[1] = halfImgW;
      this.rearrange(0);

  }
  render() {
    var controllerUnits=[],
        imgFigures =[];

    imageDatas.forEach(function(value,index){
      if(!this.state.imgsArrangeArr[index]){
        this.state.imgsArrangeArr[index] = {
          pos:{
            left:0,
            top:0
          },
          rotate:0,
          isInverse:false
        }
      }
      imgFigures.push(
        <ImgFigure data ={value}
                   ref = {'imgFigure' + index}
                   arrange ={this.state.imgsArrangeArr[index]}
                    inverse ={this.inverse(index)}
                    center={this.center(index)}
        />)
    }.bind(this));
    return (
      <section className="stage" ref="stage">
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
