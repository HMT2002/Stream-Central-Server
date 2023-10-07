Video Streaming with load balancing
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

Server RTMP có thể được stream trên các port 1935 + SERVERINDEX của server

Khi chạy npm start server thì là bật 1 server host live streaming, muốn có video streaming thì phải tạo luồng (stream) và chiếu lên host đó. Không biết lệnh thì có sẵn command line luôn.

    streamnameip.bat <tên video> localhost:1936

 Lưu ý là chỉ có các trình duyệt, phần mềm nhất định mới hỗ trợ redirect phương thức HTTP thành RTMP, nghĩa là chỉ có phần mềm chẳng hạn như VLC có thể truy cập vào đường dẫn redirect live stream của backend.
    
    rtmp://localhost:1936/live/<tên video đang stream>
