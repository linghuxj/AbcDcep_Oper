# 运营平台

### 开发发布生产注意

项目采用 master-dev 开发-发布模式，只允许在 dev 分支开发提交代码，测试环境已集成 jenkins 自动打包，只需要提交代码即可。发布 production 则 pr 合并到 master。再发布到生产服务器

### api 文档地址

生产地址：http://operdev.csshujin.cn:8000/
测试地址：http://opertest.csshujin.cn:8000/
文档管理菜单部分

### 已完成功能

- 用户管理功能
- 文档管理

### 未完成部分

- 暂无，如有新功能请咨询产品

### 已完成暂未发布页面

- app 管理热搜圈子排序规则功能
- 系统头像管理

### 项目目录结构

```bash
├── assets
│   ├──
│   views     功能页面
│   │   ├── app        app管理
│   │   ├── circle       圈子相关页面
│   │   ├── feeds        内容相关页面
│   │   └── platform      平台相关页面

```

### 启动项目

```bash

git clone http://1.14.166.221:7099/web/DCEP-Platform.git

cd DCEP-Platform

cnpm install

npm run dev
```

### 自定义组件部分

- 1、表示标签的组件 <wel-tag>
- type可选值：primary-蓝色、success-绿色、info-灰色、warning-橙色、danger-红色，不填的时候默认
- 冻结类型(info-灰色)  正常或已同意类型(primary-蓝色)  失败或拒绝类型(danger-红色)  待处理类型(默认)
- 示例： <wel-tag type="primary">微妮儿</wel-tag>

- 2、表示左右箭头标签的组件 <triangle-label>
- slot="triangle-left" 表示左边箭头  slot="triangle-right" 表示右边箭头
- 示例： <triangle-label><span slot="triangle-left" /></triangle-label>


(一) 组件规范
1、组件名为多个单词
组件名应该始终是多个单词的，且命名规范为 KebabCase格式

这样做可以避免跟现有的以及未来的 HTML 元素相冲突，因为所有的 HTML 元素名称都是单个单词的。

正例：

export default {
	name: 'TodoItem',
    ...}
反例：

export default {
  name: 'Todo',
  // ...}Vue.component('todo', {
  // ...})
2、组件名称为 pascal-case 格式
正例：

my-component.vue
反例：

myComponent.vue
3、为基础文件名为 base开头，使用完整单词
正例：

base-button.vue
反例：

MyButton.vue
4、和父组件紧密契合的子组件以父组件名为前缀名
父组件：todo-list.vue

正例：

todo-list-item.vue
todo-list-button.vue
反例：

todoItem.vue



5、在 template 模板中使用组件，应使用 PascalCase 模式，并且使用自闭合组件
正例：

<!-- 在单文件组件和字符串模板中 --><MyComponent/>
    <!-- 在 DOM 模板中 或者 在所有地方 --><my-component></my-component>
反例：

<!-- 在单文件组件和字符串模板中 --><myComponent/>
6、组件的 data 必须是一个函数。
正例：

// In a .vue fileexport default {
  data () {
    return {
      foo: 'bar'
    }
  }}
反例：

export default {
  data: {
    foo: 'bar'
  }}
7、Props定义应该尽量详细
命名：使用cameCase驼峰命名

必须指定类型

必须加上注释，表明其含义

必须加上require或者 default，两者二选一

如果业务需要，必须加上 validator验证

正例：

props: {
	// 组件状态，用于控制组件的颜色
    status: {
		type: String,
        required: true,
        validator: function (value) {
			return {
				'succ',
                'info',
                'error'
            }.indexOf(value) !== -1
        }
    }
}
8、为组件样式设置作用域
写CSS样式时，加上 作用域 scope

正例：

<stype scoped>
    .btn-close {
		font-size: 16px;
    }
</style>
9、如果特性元素过多，应主动换行
正例：

<MyConponent foo="a" bar="b"
             baz="z" />
(二) 模板中使用简单的表达式
组件模板中应该只包含简单的表达式，如果有复杂的表达式，应该使用计算属性或法

正例：

<!-- 在模板中 -->
{{ normalizedFullName }}
// 复杂表达式已经移入一个计算属性
computed: {
  normalizedFullName: function () {
    return this.fullName.split(' ').map(function (word) {
      return word[0].toUpperCase() + word.slice(1)
    }).join(' ')
  }
}
(三) 指令使用缩写形式
指令缩写 (用 : 表示 v-bind: 、用 @ 表示 v-on: 和用 # 表示 v-slot:) 应该要么都用要么都不用。

(四) 标签顺序保持一致
<template>...</template>
<script> ... </script>
<style> </style>
(五) script标签内部解构顺序
components --> props --> data --> computed --> watch --> filter --> 钩子函数 --> methods



二、	资源管理：
1、	移除无用资源文件：比如开发中引入的图片文件更换成网络图片之后如要移除本地的静态资源图片，不用的js文件及时清除，不用的代码及时清除等；
2、	封装跳转接口：对需要跳转的接口进行封装统一管理，该方式可以避免同一跳转页面更换之后，部分页面没有及时修改引起的bug错误，方便统一维护；
3、	封装请求接口：对后台接口进行封装管理，方便统一维护。

三、	模块化开发：
模块的概念：隔离/封装 高内聚、松耦合、统一接口、业务框架、业务模块、横向分块
模块化就是将同一类型的代码整合在一起。
对公共文件同一提取

四、	组件化开发：
组件化的概念：实现代码的重用
对同一业务功能相关的代码进行提取封装，实现重用。

五、	业务：
1、	对data数据进行分类管理，data数据可分为参数类型、操作类型、其他类型三类；
data: {
		//表示参数类
		parameter：{},
		// 操作类型
			interactive：{}，
			// 其他
other：{}，
// 分页
pagination: {}
}

2、	页面初始化方式进行封装，便于需要的地方调用和维护；
3、	if的逻辑语法推荐使用卫语句，多层嵌套的if语句改为卫语句；
比如：
if(obj == null){
   return;
}
this.doSomething()

4、	页面回退，推荐使用传参的方式，在上一页面对数据进行处理，不推荐在回退页进行业务处理。
5、	函数命名规范：小驼峰式命名法，前缀应该为动词；
5.1 动词含义：can判断是否可执行某个动作，has判断是否含有某个值，is判断是否为某个值，get获取某个值，set设置某个值，load加载某些数据，init初始化某些数据，request请求某些数据
	6、日志级别规范 分别为debug、info、warn以及error。
debug：调试日志。（在调用比较频繁以及容易出现问题的模块或者业务中，需留下该调试日志，以方便开发人员在使用中得到相关调试信息。如：request.js请求封装中对请求返回的内容监听。）
info：消息日志。（在开发中尽量不要出现的日志级别，通过前端数据收集来进行数据查看，周期性进行上报）
warn：警告日志。（在调试面板中出现了该日志级别尽量进行调整，以免上线后出现不可预知性问题，该级别日志同样是前端数据所需收集和采集上报）
error：错误日志。（在开发无论如何需要解决的日志信息，该信息作为前端必须收集以及采集数据上报的信息）

6、	回调函数统一使用Promise函数的方式编写；
7、	操作：操作分为页面操作和业务操作，不同的操作使用不同的函数方法，操作又包含操作前、操作中、操作后；
8、	变量：开发中尽量使用局部变量，减少全局变量的使用，变量命名使用驼峰命名法；
9、	方法命名使用驼峰命名法，方法命名应简洁直观，每个方法中处理响应的逻辑；
10、	数据初始化时string型用null，number型用0，boolean型用true/false，数组使用[]，对象使用{}，数组清空的方式可以使用arr(0.arr.length)或者arr.length=0；
11、	开发中尽量多的使用注解；
每个js文件前加上多行注解，包括该js的功能作用、建立者名称、建立时间
/**
* 时间组件，处理各类与时间相关的业务
* @author yangjq
* @date 2021-06-09
*/
方法前的注解方法：功能描述、参数
/**
* 页面下拉操作
* @param size 页面分页条数 
* @param current 当前页
*/

六、	流程
1、	git 代码提交一定要描述清晰，代码提交分为：代码优化、bug修复、错误修复、新增功能、项目重构、代码重构等；示例：【新增页面】新增团队数据页面。
2、	版本发布：每次发布版本，记录版本号，将版本中涉及的新增、修改、维护等改动信息提取出来，按照时间线记录，并发布到研发群，供测试人员进行测试。


