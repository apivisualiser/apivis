import * as light from "./ThemeLight.svelte";
import * as dark from "./ThemeDark.svelte";

export function getThemes() {
  return [light, dark];
}
