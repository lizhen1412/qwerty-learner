/**
 * 应用程序主入口函数
 * 初始化并运行Tauri应用程序
 */
fn main() {
  // 在Windows发布版本中防止出现额外的控制台窗口，不要删除此配置！
  // 仅在非调试模式下生效
  #![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

  // 使用默认配置构建Tauri应用
  tauri::Builder::default()
    // 运行应用，使用自动生成的上下文
    .run(tauri::generate_context!())
    // 如果运行失败，输出错误信息
    .expect("运行Tauri应用时发生错误");
}