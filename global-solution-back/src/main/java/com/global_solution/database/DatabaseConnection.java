package com.global_solution.database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;
import java.io.FileInputStream;
import java.io.IOException;

public class DatabaseConnection {
    private static String URL;
    private static String USER;
    private static String PASSWORD;
    private static String DRIVER;

    private static DatabaseConnection instance;
    private Connection connection;

    private DatabaseConnection() { }

    public static synchronized DatabaseConnection getInstance() {
        if (instance == null) {
            try {
                instance = new DatabaseConnection();
                instance.loadEnv();
            } catch (IOException e) {
                throw new RuntimeException("Erro ao carregar configurações do banco de dados", e);
            }
        }
        return instance;
    }

    public Connection getConnection() throws SQLException {
        try {
            if (connection == null || connection.isClosed() || !connection.isValid(5)) {
                Class.forName(DRIVER);
                Properties props = new Properties();
                props.setProperty("user", USER);
                props.setProperty("password", PASSWORD);
                props.setProperty("SetBigStringTryClob", "true");
                props.setProperty("defaultNChar", "true");
                this.connection = DriverManager.getConnection(URL, props);
                this.connection.setAutoCommit(false);
                System.out.print("Conexão estabelecida com sucesso com Oracle Database\n\n");
            }
        } catch (ClassNotFoundException e) {
            throw new SQLException("Erro ao conectar com banco de dados: " + e.getMessage(), e);
        }
        return connection;
    }

    private void loadEnv() throws IOException {
        Properties env = new Properties();
        try (FileInputStream fis = new FileInputStream(".env")) {
            env.load(fis);
            URL = env.getProperty("ORACLE_URL");
            USER = env.getProperty("ORACLE_USER");
            PASSWORD = env.getProperty("ORACLE_PASSWORD");
            DRIVER = env.getProperty("ORACLE_DRIVER");
        } catch (IOException e) {
            throw new IOException("Erro ao carregar arquivo .env: " + e.getMessage(), e);
        }
    }

    public void commit() throws SQLException {
        Connection conn = getConnection();
        if (conn != null && !conn.getAutoCommit()) {
            conn.commit();
            System.out.println("Transação commitada com sucesso");
        }
    }

    public void rollback() throws SQLException {
        Connection conn = getConnection();
        if (conn != null && !conn.getAutoCommit()) {
            conn.rollback();
            System.out.println("Transação revertida (rollback)");
        }
    }
}

