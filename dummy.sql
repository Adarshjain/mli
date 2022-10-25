CREATE TABLE Projects (
  id INT NOT NULL,
  name varchar(191),
  specification TEXT,
  project_date DATE,
  deliver_date DATE,
  amount INT,
  PRIMARY KEY (id)
);

ALTER TABLE Projects ADD half_bill varchar(191);

ALTER TABLE `Projects` ADD COLUMN `id` INT AUTO_INCREMENT UNIQUE FIRST;

CREATE TABLE Transactions (
  id INT NOT NULL AUTO_INCREMENT UNIQUE,
  is_credit INT,
  project_id INT,
  narration TEXT,
  transact_date DATE,
  customer_id INT,
  amount INT,
  PRIMARY KEY (`id`)
);
