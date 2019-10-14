
class BasicClass {
  constructor(x,y) {
    this.x = x
    this.y = y
  }
  hoge(){
    return "hoge!!"
  }
}

class ExClass extends BasicClass {
  // call parent constructor
  constructor(x,y,...args) {
    /**
     * If you do not super ()
     * you can not use the 'this' in the constructor
     */
    super(x,y)
    this.args = args
  }
  getParam (){
    return `${this.x} ${this.y}`
  }
  /**
   * static method
   */
  static calc(a,b){
    return a + b
  }
  get param() {
    return this.args
  }
  /**
   * getter, setter
   */
  get getProp() {
    return this.x
  }
  set setProp(z) {
    this.y = z
  }
  /**
   * parent method
   */
  hoge (){
    super.hoge()
  }
}

const c = new ExClass("hello","world")
c.setProp = "es6 world"
const message = c.getParam()

const cc = new ExClass("hello","es6","and","webpack","world",)
const ccParam = cc.param

ExClass.calc(2,4)
