package com.globalradio.app;

import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;

import androidx.appcompat.widget.Toolbar;
import androidx.coordinatorlayout.widget.CoordinatorLayout;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    private static final int MENU_SERVER_SETTINGS = 1;
    // ?change=1 forces the shell to render the input form instead of
    // auto-connecting to the previously saved URL. This prevents the
    // backend URL from being exposed in the input field.
    private static final String SHELL_URL = "https://localhost/index.html?change=1";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setupToolbar();
    }

    private void setupToolbar() {
        View webView = findViewById(com.getcapacitor.android.R.id.webview);
        if (!(webView.getParent() instanceof CoordinatorLayout)) {
            return;
        }

        CoordinatorLayout layout = (CoordinatorLayout) webView.getParent();
        Toolbar toolbar = new Toolbar(this);
        toolbar.setTitle(R.string.app_name);
        setSupportActionBar(toolbar);

        CoordinatorLayout.LayoutParams toolbarParams = new CoordinatorLayout.LayoutParams(
            CoordinatorLayout.LayoutParams.MATCH_PARENT,
            CoordinatorLayout.LayoutParams.WRAP_CONTENT
        );
        layout.addView(toolbar, toolbarParams);

        toolbar.post(() -> {
            CoordinatorLayout.LayoutParams webParams =
                (CoordinatorLayout.LayoutParams) webView.getLayoutParams();
            webParams.topMargin = toolbar.getHeight();
            webView.setLayoutParams(webParams);
        });
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        menu.add(0, MENU_SERVER_SETTINGS, 0, R.string.menu_server_settings);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == MENU_SERVER_SETTINGS) {
            openServerSettings();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

    private void openServerSettings() {
        if (getBridge() != null && getBridge().getWebView() != null) {
            getBridge().getWebView().loadUrl(SHELL_URL);
        }
    }
}
