#!/bin/bash
set -e

echo "开始配置CNQuake2..."

# 替换腾讯地图API密钥
if [ ! -z "$TENCENT_MAP_API_KEY" ]; then
  echo "正在替换腾讯地图API密钥..."
  sed -i "s/OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77/$TENCENT_MAP_API_KEY/g" /usr/share/nginx/html/index.html
fi

# 设置默认位置
if [ ! -z "$DEFAULT_LONGITUDE" ] && [ ! -z "$DEFAULT_LATITUDE" ] && [ ! -z "$DEFAULT_LOCATION" ]; then
  echo "正在设置默认位置信息..."
  mkdir -p /usr/share/nginx/html/js
  echo "// 默认位置设置" > /usr/share/nginx/html/js/default-location.js
  echo "localStorage.setItem(\"longitude\", \"$DEFAULT_LONGITUDE\");" >> /usr/share/nginx/html/js/default-location.js
  echo "localStorage.setItem(\"latitude\", \"$DEFAULT_LATITUDE\");" >> /usr/share/nginx/html/js/default-location.js
  echo "localStorage.setItem(\"location\", \"$DEFAULT_LOCATION\");" >> /usr/share/nginx/html/js/default-location.js
  
  # 在index.html中引入这个文件
  sed -i '/<\/head>/i\    <script src="./js/default-location.js"></script>' /usr/share/nginx/html/index.html
fi

# 设置预警参数
if [ ! -z "$MIN_MAGNITUDE" ]; then
  echo "正在设置最小预警震级..."
  if [ -f "/usr/share/nginx/html/js/index.js" ]; then
    sed -i "s/const MIN_MAGNITUDE = [0-9]\+\.[0-9]\+;/const MIN_MAGNITUDE = $MIN_MAGNITUDE;/g" /usr/share/nginx/html/js/index.js
  fi
fi

# 创建目录
mkdir -p /usr/share/nginx/html/js/lib

# 下载JavaScript库
echo "正在下载JavaScript库..."

# 下载jQuery
echo "正在下载jQuery..."
if curl -s -o /usr/share/nginx/html/js/lib/jquery.min.js --connect-timeout 5 --max-time 5 https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js; then
  echo "jQuery下载成功"
else
  echo "jQuery下载失败，尝试备用源..."
  if curl -s -o /usr/share/nginx/html/js/lib/jquery.min.js --connect-timeout 5 --max-time 5 https://cdn.bootcdn.net/ajax/libs/jquery/3.7.1/jquery.min.js; then
    echo "jQuery从备用源下载成功"
  else
    echo "jQuery下载失败，应用可能无法正常工作"
  fi
fi

# 下载Toastr
echo "正在下载Toastr..."
if curl -s -o /usr/share/nginx/html/js/lib/toastr.min.js --connect-timeout 5 --max-time 5 https://cdn.jsdelivr.net/npm/toastr@2.1.4/toastr.min.js; then
  echo "Toastr下载成功"
else
  echo "Toastr下载失败，尝试备用源..."
  if curl -s -o /usr/share/nginx/html/js/lib/toastr.min.js --connect-timeout 5 --max-time 5 https://cdn.bootcdn.net/ajax/libs/toastr.js/2.1.4/toastr.min.js; then
    echo "Toastr从备用源下载成功"
  else
    echo "Toastr下载失败，应用可能无法正常工作"
  fi
fi

# 下载OpenCC
echo "正在下载OpenCC..."
if curl -s -o /usr/share/nginx/html/js/lib/t2cn.js --connect-timeout 5 --max-time 5 https://cdn.jsdelivr.net/npm/opencc-js@1.0.5/dist/umd/t2cn.js; then
  echo "OpenCC下载成功"
else
  echo "OpenCC下载失败，尝试备用源..."
  if curl -s -o /usr/share/nginx/html/js/lib/t2cn.js --connect-timeout 5 --max-time 5 https://cdn.bootcdn.net/ajax/libs/opencc-js/1.0.5/umd/t2cn.js; then
    echo "OpenCC从备用源下载成功"
  else
    echo "OpenCC下载失败，应用可能无法正常工作"
  fi
fi

# 修改index.html引用本地文件
echo "修改index.html引用本地文件..."
sed -i 's|https://cdn.iocdn.cc/npm/jquery@3.7.1/dist/jquery.min.js|./js/lib/jquery.min.js|g' /usr/share/nginx/html/index.html
sed -i 's|https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js|./js/lib/jquery.min.js|g' /usr/share/nginx/html/index.html
sed -i 's|https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.7.1/jquery.min.js|./js/lib/jquery.min.js|g' /usr/share/nginx/html/index.html
sed -i 's|https://cdn.bootcdn.net/ajax/libs/jquery/3.7.1/jquery.min.js|./js/lib/jquery.min.js|g' /usr/share/nginx/html/index.html
sed -i 's|https://cdn.staticfile.org/jquery/3.7.1/jquery.min.js|./js/lib/jquery.min.js|g' /usr/share/nginx/html/index.html

sed -i 's|https://cdn.iocdn.cc/npm/toastr@2.1.4/toastr.min.js|./js/lib/toastr.min.js|g' /usr/share/nginx/html/index.html
sed -i 's|https://cdn.jsdelivr.net/npm/toastr@2.1.4/toastr.min.js|./js/lib/toastr.min.js|g' /usr/share/nginx/html/index.html
sed -i 's|https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/toastr.js/2.1.4/toastr.min.js|./js/lib/toastr.min.js|g' /usr/share/nginx/html/index.html
sed -i 's|https://cdn.bootcdn.net/ajax/libs/toastr.js/2.1.4/toastr.min.js|./js/lib/toastr.min.js|g' /usr/share/nginx/html/index.html
sed -i 's|https://cdn.staticfile.org/toastr.js/2.1.4/toastr.min.js|./js/lib/toastr.min.js|g' /usr/share/nginx/html/index.html

sed -i 's|https://cdn.iocdn.cc/npm/opencc-js@1.0.5/dist/umd/t2cn.js|./js/lib/t2cn.js|g' /usr/share/nginx/html/index.html
sed -i 's|https://cdn.jsdelivr.net/npm/opencc-js@1.0.5/dist/umd/t2cn.js|./js/lib/t2cn.js|g' /usr/share/nginx/html/index.html
sed -i 's|https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/opencc-js/1.0.5/umd/t2cn.js|./js/lib/t2cn.js|g' /usr/share/nginx/html/index.html
sed -i 's|https://cdn.bootcdn.net/ajax/libs/opencc-js/1.0.5/umd/t2cn.js|./js/lib/t2cn.js|g' /usr/share/nginx/html/index.html
sed -i 's|https://cdn.staticfile.org/opencc-js/1.0.5/umd/t2cn.js|./js/lib/t2cn.js|g' /usr/share/nginx/html/index.html

# 确保腾讯地图API使用HTTPS
sed -i 's|http://map.qq.com|https://map.qq.com|g' /usr/share/nginx/html/index.html

echo "CNQuake2配置完成！"

# 执行传入的命令
exec "$@"
