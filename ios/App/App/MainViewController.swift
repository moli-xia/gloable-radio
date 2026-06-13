import UIKit
import Capacitor

class MainViewController: CAPBridgeViewController {
    // ?change=1 forces the shell to render the input form instead of
    // auto-connecting to the previously saved URL. This prevents the
    // backend URL from being exposed in the input field.
    private let shellURL = "https://localhost/index.html?change=1"
    private var toolbar: UIToolbar?

    override func viewDidLoad() {
        super.viewDidLoad()
        setupToolbar()
    }

    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()

        guard let toolbar = toolbar, let webView = bridge?.webView else {
            return
        }

        let topInset = view.safeAreaInsets.top + toolbar.frame.height
        webView.frame = CGRect(
            x: 0,
            y: topInset,
            width: view.bounds.width,
            height: view.bounds.height - topInset
        )
    }

    private func setupToolbar() {
        let toolbar = UIToolbar()
        toolbar.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(toolbar)

        let titleItem = UIBarButtonItem(
            title: NSLocalizedString("app_name", comment: "App title"),
            style: .plain,
            target: nil,
            action: nil
        )
        titleItem.isEnabled = false

        let flex = UIBarButtonItem(barButtonSystemItem: .flexibleSpace, target: nil, action: nil)
        let settingsItem = UIBarButtonItem(
            title: NSLocalizedString("menu_server_settings", comment: "Open shell settings"),
            style: .plain,
            target: self,
            action: #selector(openServerSettings)
        )

        toolbar.items = [titleItem, flex, settingsItem]

        NSLayoutConstraint.activate([
            toolbar.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            toolbar.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            toolbar.trailingAnchor.constraint(equalTo: view.trailingAnchor)
        ])

        self.toolbar = toolbar
    }

    @objc private func openServerSettings() {
        guard let url = URL(string: shellURL) else {
            return
        }
        bridge?.webView?.load(URLRequest(url: url))
    }
}
