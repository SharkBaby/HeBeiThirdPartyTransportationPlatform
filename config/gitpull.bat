REM 回到上级目录
cd ..
REM 从代码仓库里面拉取最新的代码
git pull origin hebeithirdparty
REM 更新最新的package.json里面的包
npm install
REM 复制一个脚本文件到指定目录下，这样可以正常启动
copy ..\index.js .\config\ /Y