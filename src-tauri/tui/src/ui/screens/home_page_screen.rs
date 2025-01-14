use crossterm::event::KeyCode;
use ratatui::{
    layout::Rect,
    widgets::{Block, Borders},
    Frame,
};

use crate::ui::tui::Cmd;

use super::screen::Screen;

#[derive(Clone)]
pub(crate) struct HomePageScreen;

impl HomePageScreen {
    pub(crate) fn new() -> Self {
        Self {}
    }
}

impl Screen for HomePageScreen {
    fn as_any(&self) -> &dyn std::any::Any {
        self
    }

    fn render(&self, f: &mut Frame, bounds: Rect) -> color_eyre::eyre::Result<()> {
        let block = Block::new()
            .title(" Inner content generated by page ")
            .borders(Borders::all());

        f.render_widget(block, bounds);

        Ok(())
    }

    fn handle_input(&mut self, key: KeyCode) -> Cmd {
        todo!()
    }

    fn handle_cmd(&mut self, key: KeyCode) -> Cmd {
        todo!()
    }
}
