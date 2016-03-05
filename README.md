# Angular Web App 项目(抛离Ionic)

###克隆代码
    git clone https://github.com/xudao520/newApp.git;

### 自动化程序
1. 压缩html代码.

        gulp minify-html

2. 压缩css/js代码.

        gulp minify-js-css

3. 一键压缩代码(压缩过的文件全部迁移到www同级dist目录下).

       gulp build

4. 本地跑项目

        node serve
        在浏览器输入http://localhost:5000/即可