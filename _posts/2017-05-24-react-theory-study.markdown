---
layout: post
category: "react"
title:  "react学习"
tags: ["react"]
---

#### react简介

用于构建用户界面的JavaScript库

React.js是一个帮助构建页面UI的库。Reactjs将页面分成了各个独立的小块，每一个快就是组件，这些组件之间可以组合、嵌套、就成了我们的页面。

一个组件的显示形态和行为有可能是由某些数据决定的。而数据是可能发生改变的，这时候组件的显示形态就会发生相应的改变。而 React.js 也提供了一种非常高效的方式帮助我们做到了数据和组件显示形态之间的同步。

react只是一个库，不是一个框架。他只提供UI层面的解决方案。需要结合其他库，Redux、React-router等来协助提供完整的解决方法。

#### 一个组件化的栗子

```js
class Component {
    setState(state) {
        const oldEl = this.el
        this.state = state
        this._renderDOM()
        if(this.onStateChange) this.onStateChange(oldEl, this.el)
    }
    _renderDOM() {
        this.el = createDOMFromString(this.render())
        if(this.onClick) {
            this.el.addEventListener('click', this.onclick.bind(this), false)
        }
        return this.el
    }
}
```

这个是一个组件父类Component，所有的组件都可以继承这个父类来构造。它定义的两个方法，一个是我们很熟悉的setState；一个是私有方法_renderDOM。

mount方法，把组件的DOM元素插入页面，并且在setState时更新页面。

```js
const mount = (component, wrapper) => {
    wrapper.appendChild(component._renderDOM())
    component.onStateChange = (oldEl, newEl) => {
        wrapper.insertBefore(oldEl, newEl);
        wrapper.removeChild(oldEl)
    }
}
```

在构造类时传入一个参数props，作为组件的配置参数。

```js
class Component {
    constructor(props = {}){
        this.props = props
        super(props)
    }
}
// 继承时，通过super(props)把props传给父类。
class newComponent extends Component {
    constructor(props){
        super(props)
        this.state = { isliked: false }
    }
}
```

组件化可以帮助我们解决前端结构的复用性问题，整个页面可以由这样的不同的组件组合、嵌套构成。

一个组件有自己的显示形态行为，组件的显示形态和行为可以由数据状态（state）和配置参数（props）共同决定。
数据状态和配置参数的改变都会影响到这个组件的显示形态。

当数据变化时，组件的显示需要更新。所以如果组件化的模式能提供一种高效的方式自动化地帮助我们更新页面，就可以大大的降低我们代码复杂度，带来更好的可维护性。

使用JSX描述UI信息

```js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
class Header extends Component {
  render () {
    return (
      <div>
        <h1>React 小书</h1>
      </div>
    )
  }
}
ReactDOM.render(
  <Header />,
  document.getElementById('root')
)
```

render函数返回的内容叫JSX

#### jsx原理

每个DOM元素的结构都可以用Javascript的对象来表示。你会发现一个DOM元素包含的信息其实只有三个：标签名，属性，子元素。
 
```html
<div class='box' id='content'>
  <div class='title'>Hello</div>
  <button>Click</button>
</div>
```
表示成js对象如下：
```js
{
  tag: 'div',
  attrs: { className: 'box', id: 'content'},
  children: [
    {
      tag: 'div',
      arrts: { className: 'title' },
      children: ['Hello']
    },
    {
      tag: 'button',
      attrs: null,
      children: ['Click']
    }
  ]
}
```

可以用js对象来描述所有能用html表示的UI信息。但是用Javascript写起来太长了，结构看起来不清晰。
React.js把js的语法扩展了一下，让 JavaScript 语言能够支持这种直接在 JavaScript 代码里面编写类似 HTML 标签结构的语法，这样写起来就方便很多了。编译的过程会把类似 HTML 的 JSX 结构转换成 JavaScript 的对象结构。

```js
render () {
    return (
        <div>
            <h1 className='title'>React 小书</h1>
        </div>
    )
}
// 编译之后
render() {
    return (
        React.createElement(
            "div",
            null,
            React.createElement(
                "h1",
                { className: 'title'},
                "React 小书"
            )
        )
    )
}
```

React.createElement会构建一个Javascript对象来描述HTML结构的信息，包括标签、属性、还有子元素等。这样的代码就是合法的Javascript代码了。所以使用React和JSX时，一定要经过编译过程。

**所谓的JSX其实就是Javascript对象。** 

有了这个表示HTML结构和信息的对象以后，就可以拿去构造真正的DOM元素，然后把这个DOM元素塞到页面上。这也是我们最后一段代码中 ReactDOM.render所干的事情：

```js
ReactDOM.render(
  <Header />,
  document.getElementById('root')
)
```
ReactDOM.render功能就是把组件渲染并且构造DOM树，然后插入到页面上的某个特定的元素上。

JSX -> babel编译 + React.js构造 -> Javascript对象结构 -> ReactDOM.render -> DOM元素 -> 插入页面 

为什么要经过“Javascript对象结构”这一层，而不直接从JSX直接渲染构造DOM结构？

1. 拿到一个UI的结构和信息的对象，不一定会把元素渲染到浏览器的普通页面上，有可能渲染到canvas或手机app（reactNative）上。

2. 有了这么一个对象。当数据变化，需要更新组件时。就可以用比较快的算法操作这个Javascript对象，而不是直接操作页面上的DOM，这样可以尽量少的减少浏览器重排，极大地优化性能。

##### 总结

1. JSX是js语言的一种语法扩展，不是HTML。
2. React.js可以用JSX来描述你的组件长什么样的。
3. JSX在编译时会变成相应的Javascript对象描述。
4. react-dom负责把这个用来描述UI信息的js对象变成DOM元素，并且渲染到页面上。

#### 组件的render方法

一个组件类必须要实现一个render方法，这个render方法必须要返回一个JSX元素。但这里要注意的是，必须要用一个外层的JSX元素把所有内容包裹起来。返回并列多个JSX元素是不合法的。

简而言之，{} 内可以放任何 JavaScript 的代码，包括变量、表达式计算、函数执行等等。 render 会把这些代码返回的内容如实地渲染到页面上，非常的灵活。（不能包含html代码片段'hello <span> xyy </span>'，因为会被转义，直接显示html样式）

表达式插入不仅仅可以用在标签内部，也可以用在标签的属性上。

class属性 => className
for属性 => htmlFor

#### 组件的组合、嵌套和组件树

#### 事件监听

在React.js不需要手动调用浏览器原生的addEventListener进行事件监听。React.js 帮我们封装好了一系列的 on* 的属性，当你需要为某个元素监听某个事件的时候，只需要简单地给它加上 on* 就可以了。而且你不需要考虑不同浏览器兼容性的问题，React.js 都帮我们封装好这些细节了。

这些事件属性名都必须要用驼峰命名法。

没有经过特殊处理，这些 on* 的事件监听只能用在普通的 HTML 的标签上，而不能用在组件标签上。也就是说，<Header onClick={…} /> 这样的写法不会有什么效果的。这一点要注意，但是有办法可以做到这样的绑定，以后我们会提及。现在只要记住一点就可以了：这些 on* 的事件监听只能用在普通的 HTML 的标签上，而不能用在组件标签上。

##### event对象

事件监听函数会被自动传入一个event对象，这个对象和普通的浏览器event对象所包含的方法和属性都基本一致。不同的是 React.js 中的 event 对象并不是浏览器提供的，而是它自己内部所构建的。React.js 将浏览器原生的 event 对象封装了一下，对外提供统一的 API 和属性，这样你就不用考虑不同浏览器的兼容性问题。这个event对象是符合W3C标准的，它具有类似于event.stopPropagation、event.preventDefault 这种常用的方法。

##### 关于事件中的this

```js
render () {
    return (
      <h1 onClick={this.handleClickOnTitle}>React 小书</h1>
    )
}
```
一般在某个类中的实例方法里面的this指向这个实例本身。但是handleClickOnTitle函数中的this是null或undefined。

因为React.js调用你所传给它的方法的时候，并不是通过对象方法的方式调用（this.handleClickOnTitle），而是直接通过函数调用 （handleClickOnTitle），所以事件监听函数内并不能通过this获取到实例。

要想使用当前的实例，需要bind到当前实例上。
```js
render () {
    return (
      <h1 onClick={this.handleClickOnTitle.bind(this)}>React 小书</h1>
    )
}
```

##### 总结

1. 为 React的组件添加事件监听是很简单的事情，你只需要使用 React.js 提供了一系列的 on* 方法即可。

2. React.js会给每个事件监听传入一个 event 对象，这个对象提供的功能和浏览器提供的功能一致，而且它是兼容所有浏览器的。

3. React.js的事件监听方法需要手动 bind 到当前实例，这种模式在 React.js 中非常常用。

#### 组件的state和setState

##### setState接受对象参数

setState方法由父类Component所提供。当我们调用这个函数时，React.js会更新组件的状态state，并重新调用render方法，然后再把render方法所渲染的最新的内容显示到页面上。

**注意**
当我们要改变组件的状态的时候，不能直接用 this.state = xxx 这种方式来修改，如果这样做 React.js 就没办法知道你修改了组件的状态，它也就没有办法更新页面。所以，一定要使用 React.js 提供的 setState 方法，它接受一个对象或者函数作为参数。


##### setState接受函数参数

**注意**
当你调用 setState 的时候，React.js 并不会马上修改 state。而是把这个对象放到一个更新队列里面，稍后才会从队列当中把新的状态提取出来合并到 state 当中，然后再触发组件更新。
```js
handleClickOnLikeButton () {
    this.setState({ count: 0 }) // => this.state.count 还是 undefined
    this.setState({ count: this.state.count + 1}) // => undefined + 1 = NaN
    this.setState({ count: this.state.count + 2}) // => NaN + 2 = NaN
}
```
这里就自然地引出了 setState 的第二种使用方式，可以接受一个函数作为参数。React.js 会把上一个 setState 的结果传入这个函数，你就可以使用该结果进行运算、操作，然后返回一个对象作为更新 state 的对象：

```js
handleClickOnLikeButton () {
    this.setState((prevState) => {
      return { count: 0 }
    })
    this.setState((prevState) => {
      return { count: prevState.count + 1 } // 上一个 setState 的返回是 count 为 0，当前返回 1
    })
    this.setState((prevState) => {
      return { count: prevState.count + 2 } // 上一个 setState 的返回是 count 为 1，当前返回 3
    })
    // 最后的结果是 this.state.count 为 3
}
```

##### setState合并

上面进行了三次 setState，但是实际上组件只会重新渲染一次，而不是三次；这是因为在 React.js 内部会把 JavaScript 事件循环中的消息队列的同一个消息中的 setState 都进行合并以后再重新渲染组件。

**在使用 React.js 的时候，并不需要担心多次进行 setState 会带来性能问题。**

#### 配置组件的props

每个组件都可以接受一个props参数，它是一个对象，包含了所有你对这个组件的配置。

在使用一个组件的时候，可以把参数放在标签的属性当中，所有的属性都会作为props对象的键值。

可以把参数放在表示组件的标签上，组件内部就可以通过this.props来访问到这些配置参数了。

```js
class Index extends Component {
  render () {
    return (
      <div>
        <LikeButton wordings={{likedText: '已赞', unlikedText: '赞'}} />
      </div>
    )
  }
}
class LikeButton extends Component {
    render () {
        const wordings = this.props.wordings || {
        likedText: '取消',
        unlikedText: '点赞'
        }
        return (
        <button onClick={this.handleClickOnLikeButton.bind(this)}>
            {this.state.isLiked ? wordings.likedText : wordings.unlikedText} 👍
        </button>
        )
    }
}
```

##### 默认配置defaultProps

```js
class LikeButton extends Component {
  static defaultProps = {
    likedText: '取消',
    unlikedText: '点赞'
  }
  constructor(){
    super()
    this.state = { likedText: false }
  }
}
```

##### props不可变

props一旦传入进来就不能改变。

你不能改变一个组件被渲染的时候传进来的 props。React.js 希望一个组件在输入确定的 props 的时候，能够输出确定的 UI 显示形态。如果 props 渲染过程中可以被修改，那么就会导致这个组件显示形态和行为变得不可预测，这样会可能会给组件使用者带来困惑。

但这并不意味着由 props 决定的显示形态不能被修改。组件的使用者可以主动地通过重新渲染的方式把新的 props 传入组件当中，这样这个组件中由 props 决定的显示形态也会得到相应的改变。

```js
class Index extends Component {
  constructor () {
    super()
    this.state = {
      likedText: '已赞',
      unlikedText: '赞'
    }
  }

  handleClickOnChange () {
    this.setState({
      likedText: '取消',
      unlikedText: '点赞'
    })
  }

  render () {
    return (
      <div>
        <LikeButton
          likedText={this.state.likedText}
          unlikedText={this.state.unlikedText} />
        <div>
          <button onClick={this.handleClickOnChange.bind(this)}>
            修改 wordings
          </button>
        </div>
      </div>
    )
  }
}
```

由于 setState 会导致 Index 重新渲染，所以 LikedButton 会接收到新的 props，并且重新渲染，于是它的显示形态也会得到更新。这就是通过重新渲染的方式来传入新的 props 从而达到修改 LikedButton 显示形态的效果。

##### 总结

1. 为了使得组件的可定制性更强，在使用组件时，可以在标签上加属性来传入配置参数。
2. 组件可以在内部通过this.props获取到配置参数，组件可以根据props的不同来确定自己的显示形态，达到可配置的效果。
3. 可以通过给组件添加类属性defaultProps来配置默认参数。
4. props一旦传入，就不可以在组件内部对它进行修改。但是通过父组件主动重新渲染的方式来传入新的props，从而达到更新的效果。

#### state vs props

state的主要作用是用于组件保存、控制、修改自己的可变状态。state在组件内部初始化，可以被组件自身修改，而外部不能访问也不能修改。你可以认为 state 是一个局部的、只能被组件自身控制的数据源。state 中状态可以通过 this.setState 方法进行更新，setState 会导致组件的重新渲染。

props 的主要作用是让使用该组件的父组件可以传入参数来配置该组件。它是外部传进来的配置参数，组件内部无法控制也无法修改。除非外部组件主动传入新的 props，否则组件的 props 永远保持不变。

state和props有着千丝万缕的关系。它们都可以决定组件的行为和显示形态。一个组件的state中的数据可以通过props传给子组件，一个组件可以使用外部传入的 props 来初始化自己的 state。(如果是引用类型变量，改变state的值就会改变props ?)

但是它们的职责其实非常明晰分明：state 是让组件控制自己的状态，props 是让外部对组件自己进行配置。

尽量少地用state，尽量多地用props。

没有 state 的组件叫无状态组件（stateless component），设置了 state 的叫做有状态组件（stateful component）。
因为状态会带来管理的复杂性，我们尽量多地写无状态组件，尽量少地写有状态的组件。这样会降低代码维护的难度，也会在一定程度上增强组件的可复用性。前端应用状态管理是一个复杂的问题，我们后续会继续讨论。

一个组件是通过继承 Component 来构建，一个子类就是一个组件。而用函数式的组件编写方式是一个函数就是一个组件，你可以和以前一样通过 <HellWorld /> 使用该组件。不同的是，函数式组件只能接受 props 而无法像跟类组件一样可以在 constructor 里面初始化 state。你可以理解函数式组件就是一种只能接受 props 和提供 render 方法的类组件。

#### 渲染列表数据

React.js是非常高效的，他高效依赖于所谓Virtual-DOM策略。

对于用表达式套数组罗列到页面上的元素，都要为每个元素加上key属性，这个key必须是每个元素唯一的标识。一般来说，key的值可以直接后台数据返回的id，因为后台的id都是唯一的。

当某个状态被多个组件依赖或者影响的时候，就把该状态提升到这些组件的最近公共父组件中去管理，用 props 传递数据或者函数来管理这种依赖或着影响的行为。

如何更好的管理这种被多个组件所依赖或影响的状态？

你可以看到 React.js 并没有提供好的解决方案来管理这种组件之间的共享状态。在实际项目当中状态提升并不是一个好的解决方案，所以我们后续会引入 Redux 这样的状态管理工具来帮助我们来管理这种共享状态，但是在讲解到 Redux 之前，我们暂时采取状态提升的方式来进行管理。

#### 挂载阶段的组件声明周期

```js
ReactDOM.render(<Header />, document.getElementById('root'));
// 编译后
ReactDOM.render(React.createElement(Header, null), document.getElementById('root'));
```


```js
// React.createElement 中实例化一个 Header
const header = new Header(props, children)
// React.createElement 中调用 header.render 方法渲染组件的内容
const headerJsxObject = header.render()

// ReactDOM 用渲染后的 JavaScript 对象来来构建真正的 DOM 元素
const headerDOM = createDOMFromObject(headerJsxObject)
// ReactDOM 把 DOM 元素塞到页面上
document.getElementById('root').appendChild(headerDOM)
```

我们把React.js将组件渲染，并且构造DOM元素然后塞入页面的过程称为组件的挂载（这个定义请好好记住）。

其实React.js内部对待每个组件都有这么一个过程，也就是初始化组件 -> 挂载到页面上的过程。

    constructor()
    componentWillMount()
    render()
    然后构造DOM元素插入页面
    componentDidMount()
    // ...
    // 即将从页面中删除
    componentWillUnmount()
    // 从页面中删除


componentWillMount 和 componentDidMount 都是可以像 render 方法一样自定义在组件的内部。挂载的时候，React.js 会在组件的 render 之前调用 componentWillMount，在 DOM 元素塞入页面以后调用 componentDidMount。

##### 总结

React.js将组件渲染，并且构造DOM元素然后塞入页面的过程称为组件的挂载。
componentWillMount：组件挂载开始之前，也就是在组件调用 render 方法之前调用。
componentDidMount：组件挂载完成以后，也就是 DOM 元素已经插入页面后调用。
componentWillUnmount：组件对应的 DOM 元素从页面中删除之前调用。

constructor：组件的 state 的初始化
componentWillMount：组件的启动工作，例如 Ajax 数据拉取、定时器的启动；
componentWillUnmount：组件从页面上销毁的时候，有时候需要一些数据的清理，例如定时器的清理
componentDidMount：一般来说，有些组件的启动工作是依赖 DOM 的，例如动画的启动。

#### 更新阶段的组件生命周期

就是 setState 导致 React.js 重新渲染组件并且把组件的变化应用到 DOM 元素上的过程，这是一个组件的变化过程。而 React.js 也提供了一系列的生命周期函数可以让我们在这个组件更新的过程执行一些操作。

更新阶段的组件生命周期：

shouldComponentUpdate(nextProps, nextState)：你可以通过这个方法控制组件是否重新渲染。如果返回false组件就不会重新渲染。这个生命周期在 React.js 性能优化上非常有用。
componentWillReceiveProps(nextProps)：组件从父组件接收到新的props之前调用。
componentWillUpdate()：组件开始重新渲染之前调用。
componentDidUpdate()：组件重新渲染并且把更改变更到真实的 DOM 以后调用。

#### ref和react.js中的DOM操作

React.js中提供了ref属性来帮助我们获取已经挂载的元素的DOM节点，可以给某个JSX元素加上ref属性。

```js
class AutoFocusInput extends Component {
  componentDidMount () {
    this.input.focus()
  }
  render () {
    return (
      <input ref={(input) => this.input = input} />
    )
  }
}
ReactDOM.render(
  <AutoFocusInput />,
  document.getElementById('root')
)
```
函数中我们把这个 DOM 元素设置为组件实例的一个属性，这样以后我们就可以通过 this.input 获取到这个 DOM 元素。

可以在componentDidMount中使用这个DOM元素，并且调用 this.input.focus() 的 DOM API。

能不用 ref 就不用。特别是要避免用 ref 来做 React.js 本来就可以帮助你做到的页面自动更新的操作和事件监听。

#### props.children和容器类组件

有一类组件，充当了容器的作用，它定义了一种外层结果形式，然后你可以往里面塞任意的内容。

组件本身是一个不带任何内容的方形的容器。

```js
class Card extends Component {
  render () {
    return (
      <div className='card'>
        <div className='card-content'>
          {this.props.content}
        </div>
      </div>
    )
  }
}
ReactDOM.render(
  <Card content={
    <div>
      <h2>React.js 小书</h2>
       <div>开源、免费、专业、简单</div>
      订阅：<input />
    </div>
  } />,
  document.getElementById('root')
)
```

我们通过给 Card 组件传入一个 content 属性，这个属性可以传入任意的 JSX 结构。然后在 Card 内部会通过 {this.props.content} 把内容渲染到页面上。

React.js 默认就支持下面这种写法，所有嵌套在组件中的 JSX 结构都可以在组件内部通过 props.children 获取到：

```js
ReactDOM.render(
  <Card>
    <h2>React.js 小书</h2>
    <div>开源、免费、专业、简单</div>
    订阅：<input />
  </Card>,
  document.getElementById('root')
)
class Card extends Component {
    render() {
        return (
            <div className='card'>
                <div className='card-content'>
                    {this.props.children}
                </div>
            </div>
        )
    }
}
```
##### 总结

使用自定义组件的时候，可以在其中嵌套JSX结构。嵌套的结构在组件内部都可以通过props.children获取到，这种组件编写方式在编写容器类型的组件当中非常有用。而在实际的 React.js 项目当中，我们几乎每天都需要用这种方式来编写组件。

#### dangerouslySetHTML 和 style属性

##### dangerouslySetHTML

出于安全考虑（XSS攻击），在React.js当中所有的表达式插入的内容都会被自动转义，就相当于 jQuery 里面的 text(…) 函数一样，任何的 HTML 格式都会被转义掉：

如何才能做到设置动态HTML结构的效果？
dangerouslySetHTML，可以让我们动态设置元素的innerHTML

```js
render() {
    return (
        <div
            className="editor-wrapper"
            dangerouslySetHTML={{__html: this.state.content}}
        />
    )
}
```
需要给 dangerouslySetInnerHTML 传入一个对象，这个对象的 __html 属性值就相当于元素的 innerHTML，这样我们就可以动态渲染元素的 innerHTML 结构了。

因为设置 innerHTML 可能会导致跨站脚本攻击（XSS），所以 React.js 团队认为把事情搞复杂可以防止（警示）大家滥用这个属性。这个属性不必要的情况就不要使用。

##### style

React.js中的元素的style属性的用法和 DOM 里面的 style 不大一样，普通的 HTML 中的：

```html
<h1 style='font-size: 12px; color: red;'>React.js 小书</h1>
<!-- 在 React.js 中你需要把 CSS 属性变成一个对象再传给元素： -->
<h1 style={{fontSize: '12px', color: 'red'}}>React.js 小书</h1>
```
style 接受一个对象，这个对象里面是这个元素的 CSS 属性键值对，原来 CSS 属性中带 - 的元素都必须要去掉 - 换成驼峰命名，如 font-size 换成 fontSize，text-align 换成 textAlign。

用对象作为 style 方便我们动态设置元素的样式。我们可以用 props 或者 state 中的数据生成样式对象再传给元素，然后用 setState 就可以修改样式，非常灵活：

```html
<h1 style={{fontSize: '12px', color: this.state.color}}>React.js 小书</h1>
```

#### PropTypes和组件参数验证

React.js 就提供了一种机制，让你可以给组件的配置参数加上类型验证。

```js
import PropTypes from 'prop-types'
static propTypes = {
  comment: PropTypes.object.isRequired
}
import react from 'react'
static propTypes = {
    hotWords: React.PropTypes.array,
    queryUrl: React.PropTypes.string,
};

PropTypes.array
PropTypes.bool
PropTypes.func
PropTypes.number
PropTypes.object
PropTypes.string
PropTypes.node
PropTypes.element
```

##### 总结
通过 PropTypes 给组件的参数做类型限制，可以在帮助我们迅速定位错误，这在构建大型应用程序的时候特别有用；另外，给组件加上 propTypes，也让组件的开发、使用更加规范清晰

#### [来自《React.js小书》作者：胡子大哈](http://huziketang.mangojuice.top/books/react/)