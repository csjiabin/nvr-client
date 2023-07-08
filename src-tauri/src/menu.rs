use tauri::utils::assets::EmbeddedAssets;
use tauri::{AboutMetadata, Context, CustomMenuItem, Menu, MenuItem, Submenu, WindowMenuEvent};

// 应用菜单项
pub fn init(context: &Context<EmbeddedAssets>) -> Menu {
    // 应用名称
    let name = &context.package_info().name;
    // tauri::Menu::os_default(name)
    // 应用主菜单
    let app_menu = Submenu::new(
        "",
        // MenuItem::About 为原生菜单
        Menu::new()
            .add_native_item(MenuItem::About(name.into(), AboutMetadata::new()))
            .add_item(CustomMenuItem::new("debug".to_string(), "Debug"))
            .add_native_item(MenuItem::Hide)
            .add_native_item(MenuItem::Quit),
    );
    // 编辑菜单（自定义菜单）
    let edit_menu = Submenu::new(
        "Edit",
        Menu::new()
            .add_item(CustomMenuItem::new("undo".to_string(), "Undo"))
            .add_item(CustomMenuItem::new("redo".to_string(), "Redo")),
    );

    Menu::new().add_submenu(app_menu).add_submenu(edit_menu)
}

// 应用菜单处理事件
pub fn handler(event: WindowMenuEvent) {
    // 菜单所属的窗口
    let _win = Some(event.window());

    // 匹配菜单 id
    match event.menu_item_id() {
        "debug" => {
            #[cfg(debug_assertions)]
            {
                _win.unwrap().open_devtools();
            }
        }
        _ => {}
    }
}
