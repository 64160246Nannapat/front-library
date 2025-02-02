<template>
  <v-main style="height: 500px; margin-top: 55px">
    <v-container>
      <div class="header">
        <img class="header-image" src="@/assets/dashboard (1).png" alt="Library Image" />
        <h1>Dashboad</h1>
      </div>

      <v-row>
        <!-- Summary Cards -->
        <v-col cols="12" md="3">
          <v-card outlined>
            <v-card-title>Today's Sales</v-card-title>
            <v-card-text> <v-icon color="green">mdi-cash</v-icon> ฿50,000 </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card outlined>
            <v-card-title>New Orders</v-card-title>
            <v-card-text> <v-icon color="blue">mdi-cart</v-icon> 25 </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card outlined>
            <v-card-title>Total Products</v-card-title>
            <v-card-text> <v-icon color="orange">mdi-package-variant</v-icon> 120 </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card outlined>
            <v-card-title>New Customers</v-card-title>
            <v-card-text> <v-icon color="purple">mdi-account-plus</v-icon> 10 </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Charts Section -->
      <v-row>
        <v-col cols="12" md="8">
          <v-card outlined>
            <v-card-title>Sales Trend</v-card-title>
            <v-card-text>
              <!-- Insert your chart component here -->
              <p>กราฟแสดงยอดขาย</p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card outlined>
            <v-card-title>Top Selling Categories</v-card-title>
            <v-card-text>
              <!-- Insert your chart component here -->
              <p>แผนภูมิหมวดหมู่สินค้าขายดี</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Recent Activities -->
      <v-row>
        <v-col cols="12">
          <v-card outlined>
            <v-card-title>Recent Orders</v-card-title>
            <v-card-text>
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th>Order #</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>#001</td>
                      <td>John Doe</td>
                      <td>2025-01-31</td>
                      <td>Shipped</td>
                    </tr>
                    <tr>
                      <td>#002</td>
                      <td>Jane Smith</td>
                      <td>2025-01-30</td>
                      <td>Pending</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup lang="ts"></script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.header-image {
  width: 75px;
  height: auto;
  margin-right: 15px;
}

h1 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  margin: 0;
}
</style>
