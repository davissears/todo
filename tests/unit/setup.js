// Test environment preload: registers happy-dom globals (document, window,
// localStorage, Node, etc.) for all unit tests.
import { GlobalRegistrator } from "@happy-dom/global-registrator";
GlobalRegistrator.register();
