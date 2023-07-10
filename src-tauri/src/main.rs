// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri::Manager;
mod menu;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// Create the command:
// This command must be async so that it doesn't run on the main thread.
#[tauri::command]
async fn close_splashscreen(window: tauri::Window) {
    // Close splashscreen
    if let Some(splashscreen) = window.get_window("splashscreen") {
        splashscreen.close().unwrap();
    }
    // Show main window
    window.get_window("main").unwrap().show().unwrap();
}

fn main() {
    let context = tauri::generate_context!();
    tauri::Builder::default()
        .setup(|app| {
            let splashscreen_window = app.get_window("splashscreen").unwrap();
            let main_window = app.get_window("main").unwrap();

            // we perform the initialization code on a new task so the app doesn't freeze
            tauri::async_runtime::spawn(async move {
                // initialize your app here instead of sleeping :)
                println!("Initializing...");
                std::thread::sleep(std::time::Duration::from_secs(2));
                println!("Done initializing.");
                // After it's done, close the splashscreen and display the main window
                splashscreen_window.close().unwrap();
                main_window.show().unwrap();
                #[cfg(debug_assertions)]
                {
                    main_window.open_devtools();
                }
                // WindowBuilder::new(
                //     app,
                //     "main_window".to_string(),
                //     tauri::WindowUrl::App("index.html".into()),
                // )
                // .title("NVR Client App")
                // .on_web_resource_request(|req, resp| {
                //     if req.uri().starts_with("tauri://") {
                //         resp.headers_mut().insert(
                //             "Cross-Origin-Opener-Policy",
                //             "same-origin".try_into().unwrap(),
                //         );
                //         resp.headers_mut().insert(
                //             "Cross-Origin-Embedder-Policy",
                //             "require-corp".try_into().unwrap(),
                //         );
                //         println!("done");
                //     }
                // })
                // .build()?;
            });
            // WindowBuilder::new(
            //     app,
            //     "main_window".to_string(),
            //     tauri::WindowUrl::App("index.html".into()),
            // )
            // .title("NVR Client App")
            // .on_web_resource_request(|req, resp| {
            //     if req.uri().starts_with("tauri://") {
            //         resp.headers_mut().insert(
            //             "Cross-Origin-Opener-Policy",
            //             "same-origin".try_into().unwrap(),
            //         );
            //         resp.headers_mut().insert(
            //             "Cross-Origin-Embedder-Policy",
            //             "require-corp".try_into().unwrap(),
            //         );
            //         println!("done");
            //     }
            // })
            // .build()?;
            Ok(())
        })
        .menu(menu::init(&context))
        .on_menu_event(menu::handler)
        .invoke_handler(tauri::generate_handler![greet])
        .invoke_handler(tauri::generate_handler![close_splashscreen])
        // .plugin(tauri_plugin_websocket::init())
        .run(context)
        .expect("error while running tauri application");
}
