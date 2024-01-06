# Video Streaming with load balancing
*Hướng dẫn cuối kỳ!!!*
*Đây là hướng dẫn cài đặt mới nhất của Central Server, hay còn gọi là backend, dùng để điều hướng cũng như cân bằng tải, xử lý request và làm trung gian giữa Sub Central và client. Trong git cũng có phiên bản web để xem stream và theo dõi, kiểm soát và quản lý các video cũng như các Sub Server trong hệ thống. Đây là server trung tâm cần thiết để liên kết các Sub Server với các client phiên bản website hoặc phiên bản mobile. Để xem việc triển khai Sub Server thì xem bên https://github.com/HMT2002/Stream-Sub-Server*

Hướng dẫn deploy cho VPS hệ điều hành Ubuntu 20.04.6, máy ảo mới, chưa được cài đặt.

Cần phải cài đặt các môi trường, phần mềm cần thiết trước khi deploy.

Bên trong git có 1 file scripts, chứa các lệnh để cài đặt nếu bạn chưa biết, hoặc biết rồi nhưng lười thì copy paste, chạy LẦN LƯỢT từng lệnh luôn cho lẹ.

*Sau đây là giải thích chi tiết, ai không quan tâm thì cứ bỏ qua, copy paste lệnh là deploy được.*

Đầu tiên là apt-get update là để lấy các cập nhật hệ thống, việc này đương nhiên ai cũng phải làm nếu muốn deploy lên VPS rồi.

Sau đó là cài đặt nginx, cài đặt môi trường để chạy server, ở đây là node 20.
Sau khi cài đặt nginx, ta thiết lập cài đặt, cấu hình. Trong git có file nginx.conf và streaming, đây là 2 file cấu hình cho nginx, bỏ vào folder gốc của nginx, sau đó test và  restart nginx để nhận cấu hình mới

Cài đặt các node_modules bằng `npm install`, và cài đặt thêm 1 gói mới là `pm2`, gói này mở cho server chạy liên tục thay vì tắt khi màn hình terminal mất đi.
Thế là bạn đã có trang giao diện để quản lý giữa các Sub Server cũng như quản lý thông tin phim, video, chạy mặc định trên cổng 9000 được cài đặt trong cấu hình nginx và server nodejs.

Đổi với folder frontend và dashboard dùng để quản lý trên máy cá nhân, chạy `npm install` ở 2 server để cài đặt modules, dụng lệnh `npm start` đối với frontend và `npm run dev` đối với dashboard. Frontend chạy ở cổng 3100 và dashboard chạy ở cổng 3000.

*Thế là đã có 1 Central Server để phục vụ việc quản lý, theo dõi và cân bằng tải giữa các Sub Server, ngoài ra cũng làm cầu nối giữa client như website ở folder frontend hoặc ứng dụng mobile https://github.com/HMT2002/ReactNativeStreaming*

---------------------------------------------------
*Hướng dẫn cũ* 
*(Các chức năng bên dưới vẫn có thể sử dụng nhưng không được update nữa, trừ RTMP Server, phần đó chuyển hẳn sang Sub Server nên không còn hỗ trợ nữa)*

Lưu ý!!!, muốn các hướng dẫn này có tác dụng thì phải tải FFMPEG và thêm vào đường dẫn hệ thống trước (system variables)
Cần phải di chuyển vào folder server và bật server lên trước

    cd server
    npm start

Server được bật lên, tạo các file m3u8 hoặc mpd để xem video HLS hoặc DASH.
Truy cập vào các đường dẫn để xem video

    http://localhost:9000/redirect/hls/<tên video>
    http://localhost:9000/redirect/dash/<tên video>/<tên video>

Để tạo folder Hls hoặc Dash thì dùng các command có sẵn

    batCvrtMp4Dash.bat <tên video cùng folder file batch>

Các từng loại command dành cho từng loại file, từng loại định dạng muốn đổi qua

    Mp4Dash: từ file mp4 thành list Dash
    Mp4Hls: từ file mp4 thành list Hls
    MkvDash: từ file mkv thành list Dash
    ...

Và còn các APIs khác dùng để tạo bản sao, xóa video dựa trên server khác nhau.
Backend chỉ làm nhiệm vụ điều hướng, Server sẽ là các server chịu tải, chịu lỗi. Copy folder server ra, đổi SERVERINDEX trong file config.env

<!-- 
                       _oo0oo_
                      o8888888o
                      88" . "88
                      (| -_- |)
                      0\  =  /0
                    ___/`---'\___
                  .' \\|     |// '.
                 / \\|||  :  |||// \
                / _||||| -:- |||||- \
               |   | \\\  -  /// |   |
               | \_|  ''\---/''  |_/ |
               \  .-\__  '-'  ___/-. /
             ___'. .'  /--.--\  `. .'___
          ."" '<  `.___\_<|>_/___.' >' "".
         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
         \  \ `_.   \_ __\ /__ _/   .-` /  /
     =====`-.____`.___ \_____/___.-`___.-'=====
                       `=---='


     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
                    HMT2002 copyright@
                        Hồ Minh Tuệ
-->