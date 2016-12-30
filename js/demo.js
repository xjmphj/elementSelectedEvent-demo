$(function(){
    //元素的选中、拖拽、对齐功能
    function Elementeventset(opts){  //元素事件集合
        this.ctrlKey=0; //键盘ctrl事件 默认值为0（不选中）
        this.selectEleaArr=[]; //被选中的元素集合
        this.contentEle=opts.contentEle;
        this.childEle=opts.childEle;
        this.activeEle=opts.activeEle;
        this.creatBgEleName=opts.creatBgEleName;
        this.creatBgEle=opts.creatBgEle;
        this.onlyTag=opts.onlyTag;
        this.elemTargetClick=opts.elemTargetClick;
        
        this.init();
    };
     Elementeventset.prototype.init=function(){
         this.keyDown();
         this.keyUp();
         this.otherEleDown();
         this.eleDown();
         this.eleAlignment();
     };
    Elementeventset.prototype.keyDown=function(){ 
        var _this=this;
        $(document).keydown(function(e){
            _this.ctrlKey=e.keyCode;
        });
    };
     Elementeventset.prototype.keyUp=function(){
        var _this=this;
        $(document).keyup(function(e){
            _this.ctrlKey=0;
        });
     };
     Elementeventset.prototype.setEleStyle=function(){ //设置各个选中元素样式
        var _this=this;
        $(_this.contentEle).find(_this.childEle).removeClass('active');
        $(_this.contentEle).find(_this.childEle).removeClass(_this.activeEle);

        if(_this.selectEleaArr.length>1){
             for(var i=0;i< _this.selectEleaArr.length;i++){
                _this.selectEleaArr[i].obj.addClass(_this.activeEle);
            }
        }else if(_this.selectEleaArr.length==1){
            _this.selectEleaArr[0].obj.addClass('active');
        }
        
     }
     Elementeventset.prototype.otherEleDown=function(){
         var _this=this;
        $(document).on('mousedown',function(event) {
             var startX=event.pageX,
                 startY=event.pageY,
                 elem = $(event.target),
                 elemTarget = elem.closest(_this.childEle),
                 elemTargetClick = elem.closest(_this.elemTargetClick);

            if(!elemTarget.length&&!elemTargetClick.length) { //选中其他地方

                $(_this.contentEle).append('<div class="'+_this.creatBgEleName+'"></div>');
                $(_this.creatBgEle).css({top:startY,left:startX});
                 _this.selectEleaArr=[]; 
                _this.setEleStyle();

                event.preventDefault();//阻止默认事件，取消文字选中  

                $(document).on('mousemove',function(event) {
                    var endX=event.pageX,
                        endY=event.pageY;

                    //检测样式
                    if(endX>=startX){
                        if(endY>=startY){
                            $(_this.creatBgEle).css({top:startY,height:endY-startY});
                        }else{
                            $(_this.creatBgEle).css({top:endY,height:startY-endY});
                        }
                        $(_this.creatBgEle).css({left:startX,width:endX-startX});
                    }else{
                        if(endY>=startY){
                            $(_this.creatBgEle).css({top:startY,height:endY-startY});
                        }else{
                            $(_this.creatBgEle).css({top:endY,height:startY-endY});
                        }
                        $(_this.creatBgEle).css({left:endX,width:startX-endX});
                    }

                     //获取鼠标移动中交叉的元素
                    $(_this.contentEle).find(_this.childEle).each(function() {
                        var eleX=$(this).offset().left;
                        var eleY=$(this).offset().top;
                        var eleEndX=$(this).offset().left+$(this).width();
                        var eleEndY=$(this).offset().top+$(this).height();

                        var id=$(this).attr(_this.onlyTag);
                        var arrIndex=_this.selectEleaArr.inArray($(this));

                        if((startX<=eleX&&endX<=eleX) ||(startX>=eleEndX&&endX>=eleEndX) || (startY<=eleY&&endY<=eleY) || (startY>=eleEndY&&endY>=eleEndY)){
                            if(arrIndex!=-1){
                                _this.selectEleaArr.splice(arrIndex,1);
                            }
                        }else{
                            if(arrIndex==-1){
                                _this.selectEleaArr.push({'obj':$(this),'id':$(this).attr(_this.onlyTag)});
                            }
                        }
                    });

                    _this.setEleStyle();
                }); 

                $(document).on('mouseup',function(event) {
                    $(_this.creatBgEle).remove();
                    $(document).off('mousemove');
                    $(document).off('mouseup');
                    _this.setEleStyle();
                });
            }       
        });
     };

     //触发box元素的点击、移动、鼠标弹起事件
     Elementeventset.prototype.eleDown=function(){
        var _this=this;
        $(_this.contentEle).find(_this.childEle).on('mousedown',function(ev) {
             var startX=ev.pageX,
                 startY=ev.pageY,
                 elem = $(ev.target),
                 elemTarget = elem.closest(_this.childEle);


                var arrIndex=_this.selectEleaArr.inArray( $(this));
                if(!_this.ctrlKey){  //单击的时候,没有按ctrl键盘
                    //先查询数组，当前元素是否已经被选中
                    if(arrIndex!=-1){
                        //已经选中的元素，再次单击不再处理
                        elemTarget = $(this);

                        //return false;
                    }else{  //单击未选中的元素，重置数组，放入新元素
                        _this.selectEleaArr=[];  
                        _this.selectEleaArr.push({'obj': $(this),'id': $(this).attr(_this.onlyTag)});
                    }
                }else if(_this.ctrlKey==17){ //按下ctrl 键盘并且单击的时候
                    if(arrIndex!=-1){
                        _this.selectEleaArr.splice(arrIndex,1);
                    }else{
                        _this.selectEleaArr.push({'obj': $(this),'id': $(this).attr(_this.onlyTag)});
                    }
                }
                _this.setEleStyle();

               
                //重新校对点中的元素是否是选中元素
                arrIndex=_this.selectEleaArr.inArray($(this));
                
                /*console.log('down');
                console.log(elem);
                console.log(arrIndex);*/
                if(arrIndex==-1){  //如果点击的时候没在选中元素身上，不能继续滑动
                    
                    $(document).off('mousemove');
                    $(document).off('mouseup');
                    return false;
                }

                //获取按下点与元素的差值
                for(var i=0;i<_this.selectEleaArr.length;i++){
                    var element=$(_this.selectEleaArr[i].obj),
                        eleX=element.offset().left,
                        eleY=element.offset().top;
                        _this.selectEleaArr[i].differenceX=startX-eleX;
                        _this.selectEleaArr[i].differenceY=startY-eleY;
                }
                ev.preventDefault();//阻止默认事件，取消文字选中  
                 //拖拽
                $(document).on('mousemove',function(ev) { 
                    var moveX=ev.pageX,
                        moveY=ev.pageY,
                        button = ev.originalEvent.button || ev.originalEvent.which;

                    if(button == 1 && ev.shiftKey == false){  //防止拖拽过程中
                        for(var i=0;i<_this.selectEleaArr.length;i++){
                            var element=$(_this.selectEleaArr[i].obj),
                                eleEndX=moveX - _this.selectEleaArr[i].differenceX,
                                eleEndY=moveY - _this.selectEleaArr[i].differenceY;
                                element.css({'top':eleEndY,'left':eleEndX});
                        }
                    }else{
                         $(document).off('mousemove');
                    }
                     elemTarget.setCapture&&elemTarget.setCapture();
                }); 

               $(document).on('mouseup',function() {
                    $(document).off('mousemove');
                    $(document).off('mouseup');
                    elemTarget.releaseCapture&&elemTarget.releaseCapture();
            

                });
        });
     };
     //只处理了左对齐
     Elementeventset.prototype.eleAlignment=function(){
        var _this=this;
        $('.select-content').find('.hint').click(function(event) {
            hintStyle=$(this).attr('data-hint');
            
           switch (hintStyle){
            case '左对齐' : 
                    var minLeftarr=[];
                    console.log(_this.selectEleaArr);
                    for(var i=0;i<_this.selectEleaArr.length;i++){
                      var left= $(_this.selectEleaArr[i].obj).offset().left;
                      minLeftarr.push(left);
                    }
                    minLeftarr.sort(function(a,b){
                        return a-b;
                    });

                    for(var i=0;i<_this.selectEleaArr.length;i++){
                       $(_this.selectEleaArr[i].obj).css('left',minLeftarr[0]);
                    }
                break; 
            case '水平居中对齐' :  
                break; 
            case '右对齐' : 
                break; 
            case '上对齐' : 
                break; 
            case '垂直居中对齐' : 
                break; 
            case '下对齐' : 
                break;
            case '竖直均分' : 
                break;  
            case '水平均分' : 
                break;  
            default : 

                break; 
           }
          event.stopPropagation();
        });
     };
    
    Array.prototype.inArray=function (obj){ //元素在数组中的索引值，如果存在就是i,不存在索引值是-1;
        for (var i=0;i<this.length;i++){
            if (this[i].id == obj.attr('id')){
                return i;
            }
        }
        return -1;
    };

    new Elementeventset({
        'contentEle':'#content',  //外层盒子
        'childEle':'.box',       //子元素的calss
        'activeEle':'on',         //子元素能移动的样式 on
        'creatBgEleName':'boxline',  //move 过程中创建的框
        'creatBgEle':'.boxline',     //框的选择器
        'elemTargetClick':'.select-content li',  // 左对齐的选择器
        'onlyTag':'id'     //元素的唯一标识
    });
})();

